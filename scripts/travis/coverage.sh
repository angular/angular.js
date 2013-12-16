if [ $JOB = "unit" ]; then
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start

  grunt test:jqlite --browsers Firefox --reporters coverage
fi
