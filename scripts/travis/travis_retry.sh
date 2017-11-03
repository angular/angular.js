#!/bin/bash

travis_retry() {
  local result=0
  local count=1
  while [ $count -le 2 ]; do
    [ $result -ne 0 ] && {
      echo -e "\n${ANSI_RED}The command \"$@\" failed. Retrying, $count of 3.${ANSI_RESET}\n" >&2
    }
    echo "execute"
    "$@"
    echo "after: $?"
    result=$?
    [ $result -eq 0 ] && break
    count=$(($count + 1))
    sleep 1
  done
  [ $count -gt 2 ] && {
    echo -e "\n${ANSI_RED}The command \"$@\" failed 2 times.${ANSI_RESET}\n" >&2
  }
  return $result
}