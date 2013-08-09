var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
    sharedConfig(config);

    config.set({
        frameworks:['mocha'],
        files: angularFiles.mergeFilesFor('promises'),
        exclude: angularFiles.mergeFilesFor('karmaExclude'),

        junitReporter: {
            outputFile: 'test_out/promises.xml',
            suite: 'promises'
        }
    });

    config.sauceLabs.testName = 'AngularJS: promises';
};
