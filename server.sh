#!/bin/bash

node gen_jstd_configs.js
java -jar lib/jstd-jasmine/jstestdriver/JsTestDriver.jar --port 9876 --browserTimeout 90000
