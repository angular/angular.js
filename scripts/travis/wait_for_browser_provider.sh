#!/bin/bash


# Wait for Connect to be ready before exiting
while [ ! -f $BROWSER_PROVIDER_READY_FILE ]; do
  sleep 20

  LOG_FILES=$LOGS_DIR/*

  for FILE in $LOG_FILES; do
    echo -e "\n\n\n"
    echo "================================================================================"
    echo " $FILE"
    echo "================================================================================"
    cat $FILE
  done

done
