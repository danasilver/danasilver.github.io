---
layout: project
title: Django Dana Time
date: 2014-02-25 05:02:14 EST
---

## If Django Humanize were a little more human.

This project is open source.  The code can be found at [github.com/danasilver/django-dana-time](https://github.com/danasilver/django-dana-time).

### Purpose

[Django Humanize](https://docs.djangoproject.com/en/dev/ref/contrib/humanize/) is a great tool to produce human readable times, dates, and numbers.  However `humanize.naturaltime` falls back to Django's [timesince](https://docs.djangoproject.com/en/dev/ref/templates/builtins/#std:templatefilter-timesince) template filter if the date is more than a day old.  Timesince might return something like "20 days, 5 hours," which is overly verbose for how long ago the date was.  It's more useful to know a month and date at that point than mentally counting back 20 days and 5 hours.  This becomes even more problematic when the date is over a year ago.

[Django Dana Time](https://github.com/danasilver/django-dana-time) solves this problem by falling back to real times and dates that humans can quickly understand when the date is more than a day old.  See the formatting examples below for full details.

### Formatting

| timedelta              | danatime           |
|------------------------|--------------------|
| 0 seconds              | now                |
| 1 second               | a second ago       |
| 2 - 60 seconds         | 2 - 60 seconds ago |
| 1 minute               | a minute ago       |
| 2 - 60 minutes         | 2 - 60 minutes ago |
| 1 hour, same day       | an hour ago        |
| 2 - 6 hours, same day  | 2 - 6 hours ago    |
| 6 - 24 hours, same day | 4:26 pm (12 hour)  |
| \> 24 hours, same year | Aug 10             |
| previous year          | 8/10/12            |

### Use

Save `danatime.py` in your Django app or project.

Load the filter:

{% raw %}
```
{% load danatime %}
```

Use the filter:

```
{{ mytime|danatime }}
```
{% endraw %}

### Development

Issues and pull requests are welcome.  You can open one at [github.com/danasilver/django-dana-time/issues](https://github.com/danasilver/django-dana-time/issues).