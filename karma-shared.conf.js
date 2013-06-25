module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    autoWatch: true,
    logLevel: config.LOG_INFO,
    logColors: true,
    browsers: ['Chrome']
  });
};
