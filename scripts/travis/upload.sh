#!/bin/bash

if [ "$TRAVIS_SECURE_ENV_VARS" != "true" ]; then
  echo "Exporting is only supported on the main repo."
  exit 0
fi


# Immediately exit on error.
set -e

KEY_FILE="$HOME/key.pem"


# Generate ~/.boto config for gsutil.
sed s#PRIVATE_KEY_PATH#$KEY_FILE# .boto > $HOME/.boto


# Generate (decrypt) private key.
openssl aes-256-cbc -pass env:KEY_PASS -d -in key.enc > $KEY_FILE


# Download gsutil.
curl http://storage.googleapis.com/pub/gsutil.tar.gz 2> /dev/null | tar xz


# Download and install PyCrypto (Travis/apt-get has old 2.4).
curl -L http://ftp.dlitz.net/pub/dlitz/crypto/pycrypto/pycrypto-2.6.1.tar.gz  2> /dev/null | tar xz
cd pycrypto-2.6.1
sudo python setup.py install > $LOGS_DIR/$JOB-install-pycrypto.log
cd ..


# Upload to Google Cloud Storage.
GS_BUILD_PATH=gs://angularjs-travis/$TRAVIS_BUILD_ID/
./gsutil/gsutil cp -R $LOGS_DIR $GS_BUILD_PATH

if [ $JOB = "unit" ]; then
  # Do not export these.
  rm -rf ./build/i18n
  rm -rf ./build/*.zip

  ./gsutil/gsutil cp -R ./build $GS_BUILD_PATH
fi
