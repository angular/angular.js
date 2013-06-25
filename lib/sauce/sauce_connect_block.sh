#!/bin/bash


# Wait for Connect to be ready before exiting
while [ ! -f $SAUCE_CONNECT_READY_FILE ]; do
  sleep .5
done
