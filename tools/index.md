---
layout: page
title: Tools
excerpt: "Small browser-based tools for DFIR work."
search_omit: true
---

Tools I've built for day-to-day DFIR work. Each one runs entirely in your browser: there's no account, and nothing you load is uploaded anywhere.

<div class="tool-list">
{% for tool in site.data.tools %}{% assign href = site.baseurl | append: tool.url %}
<section class="tool" id="{{ tool.name | slugify }}">
<a class="tool-icon" href="{{ href }}" tabindex="-1" aria-hidden="true"><img src="{{ site.baseurl }}{{ tool.icon }}" alt="" width="52" height="52"></a>
<div class="tool-body">
<h2 class="tool-name"><a href="{{ href }}">{{ tool.name }}</a></h2>
<p class="tool-tagline">{{ tool.tagline }}</p>
<p>{{ tool.description }}</p>
<p class="tool-good"><span>Good for</span> {{ tool.good_for }}</p>
<p class="tool-links"><a class="tool-open" href="{{ href }}">Open {{ tool.name }} <span aria-hidden="true">→</span></a>{% if tool.try %}<a href="{{ site.baseurl }}{{ tool.try }}">Try the sample</a>{% endif %}{% if tool.post %}<a href="{{ site.baseurl }}{{ tool.post }}">Read the post</a>{% endif %}</p>
</div>
</section>
{% endfor %}
</div>
