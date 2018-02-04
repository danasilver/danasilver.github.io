#!usr/bin/env python3

import os
import inspect
import logging

from jinja2 import Environment, FileSystemLoader
from staticjinja import Site

SEARCH_PATH = '.'
OUT_PATH = '_site'
ENCODING = 'utf8'

IGNORED_FILES = [
    'build.py',
    'README.md',
    'site_',
    '.git',
]

STATIC_PATHS = [
    'vendor',
    'img',
]

STATIC_EXTENSIONS = [
    'png',
    'gif',
    'eot',
    'svg',
    'woff',
    'ttf',
    'mov',
    'mp4',
    'css',
    'json',
    'csv',
    'pdf',
    'CNAME'
]

class StaticsAndIgnoresSite(Site):
    def is_static(self, filename):
        if super(StaticsAndIgnoresSite, self).is_static(filename):
            return True
        else:
            return any(filename.endswith(extension) for extension in STATIC_EXTENSIONS)

    def is_ignored(self, filename):
        if super(StaticsAndIgnoresSite, self).is_ignored(filename):
            return True
        else:
            return any((path_part in IGNORED_FILES) for path_part in filename.split(os.path.sep))

if __name__ == '__main__':
    searchpath = SEARCH_PATH or 'templates'

    # Coerce search to an absolute path if it is not already
    if not os.path.isabs(SEARCH_PATH):
        # TODO: Determine if there is a better way to write do this
        calling_module = inspect.getmodule(inspect.stack()[-1][0])
        # Absolute path to project
        project_path = os.path.realpath(os.path.dirname(
            calling_module.__file__))
        searchpath = os.path.join(project_path, searchpath)

    loader = FileSystemLoader(searchpath=searchpath,
                              encoding=ENCODING,
                              followlinks=True)
    environment = Environment(loader=loader)

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logger.addHandler(logging.StreamHandler())
    site = StaticsAndIgnoresSite(
        environment,
        searchpath=searchpath,
        outpath=OUT_PATH,
        encoding=ENCODING,
        logger=logger,
        staticpaths=STATIC_PATHS)

    site.render()
