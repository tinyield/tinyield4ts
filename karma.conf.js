// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        files: [
            'src/**/*.ts'
        ],
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.spec.json",
        },
        frameworks: ['jasmine', 'karma-typescript'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-typescript'),
            require('karma-spec-reporter'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        preprocessors: {
            'src/**/*.ts': [ 'karma-typescript' ]
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, './coverage/tinyield'),
            reports: ['html', 'lcovonly', 'text-summary'],
            fixWebpackSourcePaths: true
        },
        reporters: [ 'spec', 'karma-typescript'],
        // port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: true,
        restartOnFileChange: true
    });
};
