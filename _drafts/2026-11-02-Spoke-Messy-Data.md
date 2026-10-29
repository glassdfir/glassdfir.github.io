---
layout: post
title: "Spoke vs. Messy Exports"
date:   2026-11-02 10:00:00 -0500
categories: blogsabout
slug: spoke-messy-data
---

When I wrote about [Spoke]({{ site.baseurl }}/blogsabout/spoke/), every demo used tidy sample files. Real exports aren't tidy. They come out of an EDR console with a report title on line one, out of PowerShell in UTF-16, out of a European laptop with semicolons, or out of a SIEM with 60,000 rows when you only needed 600.

So I built a pile of deliberately broken files and threw them at Spoke until things broke. Here's what broke and what changed. Everything is live at [jon.glass/spoke](https://jon.glass/spoke/).

## The Test Pile
Every one of these is in the repo's `test/corpus` folder, and a browser test loads each one on every build:

| File | What's wrong with it | Before | Now |
|---|---|---|---|
| UTF-16 export | Excel "Unicode Text" / PowerShell `Out-File` | Column names full of `�` | Read correctly |
| Windows-1252 CSV | `Müller`, `Straße-PC` | Accents mangled | Read correctly |
| Report title above the header | `EDR Export Report`, `Generated: …`, blank line | Title became the only column | Junk lines skipped |
| Excel sheet with title rows | Same thing, in a workbook | Columns named `__EMPTY_1` | Header found |
| Duplicate and blank headers | `Name`, `Name`, `` | Blank column vanished | `Name`, `Name (2)`, `Column 3` |
| Ragged rows | Extra and missing cells | Extras hidden in a stray field | Kept in `(extra cells)` |
| A renamed binary | Random bytes called `.csv` | One column of gibberish | Refused, with a clear message |
| Nodes named `e0`, `e1` | Unlucky hostnames | **Edges silently dropped** | All edges kept |
| Nine timestamp styles | See below | 3 unreadable, 3 off by hours | All nine correct |
| 3,000 to 60,000 rows | Size | Minutes, or a frozen tab | Seconds |

The one that worried me most was the silent one. Spoke gave edges internal IDs like `e0`, `e1`, and Cytoscape quietly refuses a second element with an ID it has already seen. If a node happened to be named `e12`, edge 12 just wasn't there. No error, no warning, a missing relationship. Edge IDs now live in their own namespace.

## Headers in the Wrong Place
Exports love a preamble. Spoke now reads the file as plain rows first and looks for the first row that's as wide as the data underneath it. Everything above that is skipped, and the status line tells you how many lines it skipped so nothing happens behind your back. The same logic runs on Excel sheets, which is how this Defender-style export with three title rows maps itself:

![A Defender-style Excel export mapped automatically]({{ site.baseurl }}/images/spoke-messy-excel.png)
*Three title rows skipped, `InitiatingProcessFileName` → `FileName` guessed, and process ID plus device combined into each key.*

Column guessing learned some EDR dialects along the way: Microsoft Defender's `InitiatingProcessFileName` / `InitiatingProcessId` → `FileName` / `ProcessId`, Sysmon's `ParentImage` → `Image`, and `user` → `host` style pairs.

## Time Is Hard
I tested nine ways the same moment shows up in real exports:

```
2026-10-18T22:14:00.1234567Z      Windows / Defender, 7 decimal places
2026-10-18 22:15:00 UTC
18/10/2026 22:16:00               day first
1792361820000000                  epoch microseconds
134368354800000000                Windows FILETIME
2026-10-18 22:19:00               no zone at all
10/18/2026 10:20:00 PM
Oct 18 2026 22:21:00
1792361820.5                      epoch seconds with a fraction
```

Before, three of those were unreadable, and the zone-less ones were read as the *analyst's* local time and then shown as UTC, so they moved by four or five hours depending on where you sat. That's the kind of bug that ends up in a timeline in a report.

Now all nine parse, and zone-less times are read as **UTC by default**, which is what most security tools export. If your export used the local clock of the machine that made it, a new **Times with no zone are** setting under *Map columns* switches it, and it only appears when your time column actually has zone-less values. Day-first dates are spotted per column: if any date has a first number over 12, the whole column is read day-first.

Excel had its own version of the zone problem. Date cells don't have a zone, but the spreadsheet library hands them over as local `Date` objects, and Spoke was converting those to UTC. An 08:00 in the cell became 12:00 on screen for me in New York. Now Spoke keeps the clock time that's actually in the cell.

## Windows Doesn't Care About Case
`CMD.EXE`, `cmd.exe` and `Cmd.exe` are the same program, but they were three nodes. **Ignore case when matching names** merges them and keeps whichever spelling showed up first. It's off by default, because on Linux `Backup` and `backup` really can be two different things.

## Big Files
This was the biggest change. The Relationship Web layout was Cytoscape's *cose*, which compares every node with every other node on every pass. That's lovely at 100 nodes, takes seconds at 400, and at a few thousand it just sits there while the browser asks whether you want to kill the page.

Spoke can't pull in new packages for this (everything ships as one HTML file), so I wrote a small force-directed layout of its own: Fruchterman–Reingold with a Barnes–Hut quadtree, which treats far-away clusters of nodes as one heavy node. That makes each pass O(n log n) instead of O(n²). It lays out each connected group separately and then packs the groups into rows. It's about 200 lines of plain JavaScript with unit tests.

Spoke now picks a layout by size:
- **Up to 250 nodes:** cose, as before, because it looks best
- **Up to 8,000 nodes:** the new layout, typically a few seconds at most
- **Process Tree up to 5,000 nodes:** dagre, as long as the data really is tree-shaped. If there are many more links than nodes, Spoke says so and uses the web layout instead of hanging

![A 355-node web laid out with the new layout]({{ site.baseurl }}/images/spoke-fast-layout.png)
*900 logon rows between users and servers, laid out in about a second. cose took around four seconds on graphs this size in my tests.*

Beyond that, no layout is going to make 24,000 nodes readable anyway. Spoke puts them on a grid, says so, and points you at the tools that actually help: the filter and the time window. Whatever's left after you narrow it down gets laid out properly. If you really want the whole hairball, **Lay out anyway** is right there.

![The big-graph notice over a 24,000-node grid]({{ site.baseurl }}/images/spoke-big-graph.png)
*Too big to lay out quickly: a grid, an explanation, and a way out.*

A few smaller things help at scale too. Edge labels switch off past 5,000 edges, since measuring that many labels was the single slowest part of drawing. Styles are plain values instead of per-node functions, so Cytoscape can share them between elements. And a hub with thousands of relationships shows its first 300 in the Details panel instead of freezing it.

## Tests
None of this matters if it quietly breaks again, so Spoke has tests now:
- `npm test` runs unit tests on the parsing, decoding, timestamp and layout code
- `npm run test:e2e` loads every file in `test/corpus` into the built app in a headless browser and checks what comes out, plus generated files of 3,000 to 24,000 rows to check speed

## Try It
Grab the ugliest export you have, the one with the title rows and the timestamps nobody can agree on, and drop it on [Spoke](https://jon.glass/spoke/). It still never leaves your browser. If it trips over something, I'd like to hear about it, and that file's shape will end up in the test pile.
