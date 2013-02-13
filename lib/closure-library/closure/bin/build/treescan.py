#!/usr/bin/env python
#
# Copyright 2010 The Closure Library Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


"""Shared utility functions for scanning directory trees."""

import os
import re


__author__ = 'nnaze@google.com (Nathan Naze)'


# Matches a .js file path.
_JS_FILE_REGEX = re.compile(r'^.+\.js$')


def ScanTreeForJsFiles(root):
  """Scans a directory tree for JavaScript files.

  Args:
    root: str, Path to a root directory.

  Returns:
    An iterable of paths to JS files, relative to cwd.
  """
  return ScanTree(root, path_filter=_JS_FILE_REGEX)


def ScanTree(root, path_filter=None, ignore_hidden=True):
  """Scans a directory tree for files.

  Args:
    root: str, Path to a root directory.
    path_filter: A regular expression filter.  If set, only paths matching
      the path_filter are returned.
    ignore_hidden: If True, do not follow or return hidden directories or files
      (those starting with a '.' character).

  Yields:
    A string path to files, relative to cwd.
  """

  def OnError(os_error):
    raise os_error

  for dirpath, dirnames, filenames in os.walk(root, onerror=OnError):
    # os.walk allows us to modify dirnames to prevent decent into particular
    # directories.  Avoid hidden directories.
    for dirname in dirnames:
      if ignore_hidden and dirname.startswith('.'):
        dirnames.remove(dirname)

    for filename in filenames:

      # nothing that starts with '.'
      if ignore_hidden and filename.startswith('.'):
        continue

      fullpath = os.path.join(dirpath, filename)

      if path_filter and not path_filter.match(fullpath):
        continue

      yield os.path.normpath(fullpath)
