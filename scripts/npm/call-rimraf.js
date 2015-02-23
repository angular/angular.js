#!/usr/bin/env node

var rimraf = require('rimraf');

if (process.platform === "win32") {
  rimraf('node_modules', function() {
    console.log('cleaned node_modules using rimraf');
    process.exit(0);
  });
} else {
  process.exit(1);
}
