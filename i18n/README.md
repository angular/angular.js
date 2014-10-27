# i18n directory overview:

- closure/ - closure files we use for ruleset generation
- src/ - source files
- spec/ - spec files for stuff in src directory
- generate.sh - runs src scripts on closure dir and stores output in locale dir
- update-closure.sh - downloads the latest version of closure files from public git repo

The closure files (maintained by Shanjian Li (shanjian)) change very rarely, so we don't need to
regenerate locale files very often.

