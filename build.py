#!usr/bin/env python3

import os
import logging

from jinja2 import Environment, FileSystemLoader
from staticjinja import Site

SEARCH_PATH = os.path.abspath('.')
OUT_PATH = '_site'
ENCODING = 'utf8'

IGNORED_FILES = [
    'build.py',
    'includes',
    'README.md',
    'requirements.txt',
    '_site',
]

STATIC_PATHS = [
    'img',
    'vendor',
]

STATIC_EXTENSIONS = [
    'css',
    'csv',
    'eot',
    'gif',
    'json',
    'png',
    'mov',
    'mp4',
    'pdf',
    'svg',
    'ttf',
    'woff',
]


class StaticsAndIgnoresSite(Site):
    def is_static(self, filename):
        if super(StaticsAndIgnoresSite, self).is_static(filename):
            return True
        elif self.is_ignored(filename):
            # Don't copy files that look like static files
            # but should be ignored.
            return False
        else:
            return any(filename.endswith(extension)
                       for extension in STATIC_EXTENSIONS)

    def is_ignored(self, filename):
        if super(StaticsAndIgnoresSite, self).is_ignored(filename):
            return True
        else:
            return any((path_part in IGNORED_FILES)
                       for path_part in filename.split(os.path.sep))


if __name__ == '__main__':
    loader = FileSystemLoader(searchpath=SEARCH_PATH,
                              encoding=ENCODING,
                              followlinks=True)
    environment = Environment(loader=loader)

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logger.addHandler(logging.StreamHandler())

    site = StaticsAndIgnoresSite(
        environment,
        searchpath=SEARCH_PATH,
        outpath=OUT_PATH,
        encoding=ENCODING,
        logger=logger,
        staticpaths=STATIC_PATHS)

    site.render()
