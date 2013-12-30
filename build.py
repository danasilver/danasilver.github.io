#!/usr/bin/env python2
# -*- coding: utf-8 -*-

import os
import sys
import subprocess

project_name = os.path.basename(os.getcwd())
build_cmd = "jekyll build"
s3_cmd = "aws s3 sync _site/ s3://danasilver.org --delete"

sys.stdout.write("Building Jekyll project " + project_name + ".\n")
subprocess.Popen(build_cmd.split(" ")).communicate()

sys.stdout.write("Syncing with S3.\n")
subprocess.Popen(s3_cmd.split(" ")).communicate()
