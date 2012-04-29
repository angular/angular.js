#!/bin/sh

./gen_docs.sh

rm build/docs/index.html
rm -rf build/docs/css
rm -rf build/docs/js
rm -rf build/docs/img
rm -rf build/docs/examples

cd build/docs

ln -s ../../docs/src/templates/index.html
ln -s ../../docs/src/templates/css
ln -s ../../docs/src/templates/js
ln -s ../../docs/img
ln -s ../../docs/examples
