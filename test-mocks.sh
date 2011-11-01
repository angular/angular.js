#!/bin/bash
if [ ! -e test.dissable ]; then
  java -jar lib/jstestdriver/JsTestDriver.jar --tests all --config jsTestDriver-mocks.conf $@
fi
