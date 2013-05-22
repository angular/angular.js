#!/bin/bash
if test "$1" == ""; then
    if [ "$TRAVIS_COMMIT_RANGE" == "" -o "$TRAVIS_PULL_REQUEST" == "false" ]
    then
        echo -n "Using fallback for commit range (last commit): "
        RANGE='HEAD^..HEAD'
    else
        echo -n "Using \$TRAVIS_COMMIT_RANGE for commit range: "
        # Range is given on the form of 515744f1079f...23be2b8db4d7.
        # Therefor, we need to adjust it to Git commit range format. 
        RANGE=`echo $TRAVIS_COMMIT_RANGE | sed 's/\.\.\./../'`
    fi
else
    echo -n "Using command line parameter for commit range: "
    RANGE=$1
fi
echo $RANGE

for sha in `git log --format=oneline "$RANGE" | cut '-d ' -f1`
do
    echo -n "Checking commit message for $sha..."
    git rev-list --format=%B --max-count=1 $sha|awk '
    NR == 2 && !/^(feat|fix|docs|style|refactor|test|chore)\([^)]+\): .+/ {
        print "Incorrect, or no, commit type in subject line. Valid"
        print "types are:"
        print ""
        print " * feat"
        print " * fix"
        print " * docs"
        print " * style"
        print " * refactor"
        print " * test"
        print " * chore"
        print ""
        print "Line:"
        print $0
        exit 1
    }
    NR == 2 && /.*\.$/ {
        print "Subject must not end with a period."
        exit 1
    }
    NR == 2 && length($0) > 70 {
        print "Subject line too long."
        exit 1
    }
    NR == 3 && length($0) > 0 {
        print "Second commit message line must be empty."
        exit 1
    }
    NR > 3 && length($0) > 80 {
        print "Too long commit line (>80 characters) in message:"
        print $0
        exit 1
    }
    '
    EXITCODE=$?
    if [ $EXITCODE -ne 0 ]; then
        echo "FAILED."
        echo
        echo "Commit message for $sha is not following commit"
        echo "guidelines. Please see:"
        echo
        echo "https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y"
        exit $EXITCODE
    else
        echo "OK."
    fi
done
