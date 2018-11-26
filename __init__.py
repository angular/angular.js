#!/usr/bin/env/python3
# encoding: utf-8
'''
ripr -- shortdesc

ripr is a small app to record shoutcast or mp3 streams from the internet

It defines classes_and_methods

@author:     Adam Garcia

@copyright:  2013 All rights reserved.

@license:    MIT
'''
import sys
import os
import logging
from urllib.request import urlretrieve
from argparse import ArgumentParser
from argparse import RawDescriptionHelpFormatter
from datetime import date
import time
import signal
import datetime
import multiprocessing


__all__ = []
__version__ = 0.1
__date__ = '2013-12-23'
__updated__ = '2013-12-23'
now = time.time()

DEBUG = 0
TESTRUN = 0
PROFILE = 0
current_year = date.today().strftime("%Y")


def signal_handler(signal, frame):
        print('You pressed Ctrl+C, quitting!')
        quit(0)
signal.signal(signal.SIGINT, signal_handler)


def get_seconds(s):
    l = s.split(':')
    return int(l[0]) * 3600 + int(l[1]) * 60 + int(l[2])
        

def main(argv=None):  # IGNORE:C0111
    '''Command line options.'''

    if argv is None:
        argv = sys.argv
    else:
        sys.argv.extend(argv)

    program_name = os.path.basename(sys.argv[0])
    program_version = "v%s" % __version__
    program_build_date = str(__updated__)
    program_version_message = '%%(prog)s %s (%s)' % (program_version,
                                                     program_build_date)
    program_shortdesc = __import__('__main__').__doc__.split("\n")[1]
    program_license = '''%s

  Created by ${user_name} on %s.
  Copyright ${year} ${organization_name}. All rights reserved.

The MIT License (MIT)

Copyright (c) <current_year> Adam Garcia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


USAGE
''' % (program_shortdesc, str(__date__))

    # Setup argument parser
    parser = ArgumentParser(description=program_license,
                            formatter_class=RawDescriptionHelpFormatter)
    parser.add_argument("-v", "--verbose",
                        action="store_true",
                        help="Turns on verbose logging")
    parser.add_argument(dest="url",
                        help="""URL to record""", metavar="URL")
    parser.add_argument(dest="rec_time",
                        help="""Duration to record in HH:MM:SS format""",
                        metavar="HH:MM:SS")
    parser.add_argument("--path", "-p", dest='paths',
                        help="""paths to folder(s) to record
                        [default: %(default)s]""", metavar="PATH",
                        nargs='?', default="output.mp3", const="blabla")
    args = parser.parse_args()
    paths = args.paths
    verbose = args.verbose
    rec_time = args.rec_time
    url = args.url       
    time_limit = get_seconds(rec_time)
    def callback(count, blocksize, filesize):
        elapsed = time.time() - now
        if elapsed > time_limit:
            raise ValueError("The recording has elapsed past the set time")
    
    try:
        urlretrieve(url, paths, callback)
    except ValueError as ve:
        print("Times up!")


if __name__ == "__main__":
    if DEBUG:
        sys.argv.append("-h")
        sys.argv.append("-v")
        sys.argv.append("-r")
    if TESTRUN:
        import doctest
        doctest.testmod()
    if PROFILE:
        import cProfile
        import pstats
        profile_filename = 'streamer.ripr_profile.txt'
        cProfile.run('main()', profile_filename)
        statsfile = open("profile_stats.txt", "wb")
        p = pstats.Stats(profile_filename, stream=statsfile)
        stats = p.strip_dirs().sort_stats('cumulative')
        stats.print_stats()
        statsfile.close()
        sys.exit(0)
    sys.exit(main())
