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

"""Utility to use the Closure Compiler CLI from Python."""

import distutils.version
import logging
import re
import subprocess


# Pulls a version number from the first line of 'java -version'
# See http://java.sun.com/j2se/versioning_naming.html to learn more about the
# command's output format.
_VERSION_REGEX = re.compile('"([0-9][.0-9]*)')


def _GetJavaVersion():
  """Returns the string for the current version of Java installed."""
  proc = subprocess.Popen(['java', '-version'], stderr=subprocess.PIPE)
  unused_stdoutdata, stderrdata = proc.communicate()
  version_line = stderrdata.splitlines()[0]
  return _VERSION_REGEX.search(version_line).group(1)


def Compile(compiler_jar_path, source_paths, flags=None):
  """Prepares command-line call to Closure Compiler.

  Args:
    compiler_jar_path: Path to the Closure compiler .jar file.
    source_paths: Source paths to build, in order.
    flags: A list of additional flags to pass on to Closure Compiler.

  Returns:
    The compiled source, as a string, or None if compilation failed.
  """

  # User friendly version check.
  if not (distutils.version.LooseVersion(_GetJavaVersion()) >=
          distutils.version.LooseVersion('1.6')):
    logging.error('Closure Compiler requires Java 1.6 or higher. '
                  'Please visit http://www.java.com/getjava')
    return

  args = ['java', '-jar', compiler_jar_path]
  for path in source_paths:
    args += ['--js', path]

  if flags:
    args += flags

  logging.info('Compiling with the following command: %s', ' '.join(args))

  proc = subprocess.Popen(args, stdout=subprocess.PIPE)
  stdoutdata, unused_stderrdata = proc.communicate()

  if proc.returncode != 0:
    return

  return stdoutdata
