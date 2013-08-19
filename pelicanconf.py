#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Dana Silver'
SITENAME = u'dana.ag'
SITEURL = ''

TIMEZONE = 'Europe/Paris'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

# Blogroll
#LINKS =  (('Github', 'https://github.com/danasilver'),
#          ('Twitter', 'https://twitter.com/DanaRSilver'),)

# Social widget
SOCIAL = (('Github', 'https://github.com/danasilver'),
          ('Twitter', 'https://twitter.com/DanaRSilver'),)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

THEME = "theme"

PLUGIN_PATH = "../pelican-plugins"
PLUGINS = ['assets']