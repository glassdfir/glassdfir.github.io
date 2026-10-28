---
layout: page
title: Tools
excerpt: "Small browser-based tools for DFIR work."
search_omit: true
---

Tools I've built for day-to-day DFIR work. Each one runs entirely in your browser: there's no account, and nothing you load is uploaded anywhere.

{% for tool in site.data.tools %}
## [{{ tool.name }}]({{ site.baseurl }}{{ tool.url }})

**{{ tool.tagline }}** {{ tool.description }}

*Good for:* {{ tool.good_for }}

<a class="btn" href="{{ site.baseurl }}{{ tool.url }}">Open {{ tool.name }}</a> {% if tool.try %}<a href="{{ site.baseurl }}{{ tool.try }}">Try the sample</a>{% endif %}{% if tool.try and tool.post %} · {% endif %}{% if tool.post %}<a href="{{ site.baseurl }}{{ tool.post }}">Read the post</a>{% endif %}
{% endfor %}
