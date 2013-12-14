#!/bin/bash

echo "#################################"
echo "#### Update master ##############"
echo "#################################"

# Enable tracing and exit on first failure
set -xe

cd `dirname $0`/../..

echo "#################################"
echo "####  Jenkins Build  ############"
echo "#################################"
./jenkins_build.sh

echo "#################################"
echo "## Update code.angular.js.org ###"
echo "#################################"
./scripts/code.angularjs.org/publish.sh

echo "#################################"
echo "#### Update bower ###############"
echo "#################################"
./scripts/bower/publish.sh