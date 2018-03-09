---
layout: page
title:  Advanced DFIR Wizard Master Class
date:   2018-02-19 15:33:28 -0500
categories: adfirwmc
---

<ul class="post-list">
{% for post in site.categories.adfirwmc reversed %} 
  <li><article><a href="{{ site.url }}{{ post.url }}">{{ post.title }} {% if post.excerpt %} <span class="excerpt">{{ post.excerpt | remove: '\[ ... \]' | remove: '\( ... \)' | markdownify | strip_html | strip_newlines | escape_once }}</span>{% endif %}</a></article></li>
{% endfor %}
</ul>


 