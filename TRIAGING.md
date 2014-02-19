# Triage new issues/PRs on github

This document shows the steps the Angular team is using to triage issues.
The labels are used later on for planning releases.

## Tips ##

* Label "resolution:*"
    * these tags can be used for labeling a closed issue/PR with a reason why it was closed. (we can add reasons as we need them, right there are only a few rejection reasons. it doesn't make sense to label issues that were fixed or prs that were merged)


## Automatic processing ##

We have automatic tools (e.g. Mary Poppins) that automatically add comments / labels to issues and PRs.
The following is done automatically and should not be done manually:

* Label "cla: yes" or "cla: no" for pull requests

## Process ##

1. Open list of [non triaged issues](https://github.com/angular/angular.js/issues?direction=desc&milestone=none&page=1&sort=created&state=open)
1. Assign yourself: Pick an issue that is not assigned to anyone and assign it to you
1. Assign milestone:
    * "Docs only" milestone - for documentation PR -> **Done**.
    * Current/next milestone - regressions
    * 1.2.x - everything else
1. Label "GH: *" (to be automated via Mary Poppins)
    * PR - issue is a PR
    * issue - otherwise
1. Bugs:
    * Label "Type: Bug"
    * Label "Type: Regression" - if the bug is a regression
    * Duplicate? - Check if there are comments pointing out that this is a dupe, if they do exist verify that this is indeed a dupe and close it and go to the last step
    * Reproducible? - Steps to reproduce the bug are clear, if not ask for clarification (ideally plunker or fiddle)
    * Reproducible on master? - http://code.angularjs.org/snapshot/

1. Non bugs:
    * Label "Type: Feature" or "Type: Chore" or "Type: Perf"
    * Label "needs: breaking change" - if needed
    * Label "needs: public api" - if a new public api is needed
    * Understandable? - verify if the description of the request is clear. if not ask for clarification
    * Goals of angular core? - Often new features should be implemented as a third-party module rather than an addition to the core.

1. Label "component: *"
    * In rare cases, it's ok to have multiple components.
1. Label "impact: *"
   * small - obscure issue affecting one or handful of developers
   * medium - impacts some usage patterns
   * large - impacts most or all of angular apps
1. Label "complexity: *"
    * small - trivial change
    * medium - non-trivial but straightforward change
    * large - changes to many components in angular or any changes to $compile, ngRepeat or other "fun" components
1. Label "PRs plz!" for "GH: issue"
    * if complexity is small or medium and the problem as well as solution are well captured in the issue
1. Label "origin: google" for issues from Google
1. Label "high priority" for security issues, major performance regressions or memory leaks

1. Unassign yourself from the issue


[![Analytics](https://ga-beacon.appspot.com/UA-8594346-11/angular.js/TRIAGING.md?pixel)](https://github.com/igrigorik/ga-beacon)
