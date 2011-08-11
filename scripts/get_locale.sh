#!/bin/bash
/usr/bin/env jasmine-node spec/ --noColor | grep -v '/lib/jasmine' && node i18n/closure-slurper.js
