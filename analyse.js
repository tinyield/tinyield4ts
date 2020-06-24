const scanner = require("sonarqube-scanner");

scanner(
    {
        // this example uses local instance of SQ
        serverUrl: "https://sonarcloud.io/",
        token: process.env.SONAR_TOKEN,
        options: {
            "sonar.sources": "./src",
            "sonar.inclusions": "./src/**/*.ts",
            "sonar.exclusions": "./src/**/*.spec.ts",
            "sonar.tests": "./src",
            "sonar.tests.exclusions": "./src/**/*.ts",
            "sonar.tests.inclusions": "./src/**/*.spec.ts",
            "sonar.organization": "tinyield",
            "sonar.projectKey": "tinyield_tinyield4ts",
            "sonar.typescript.lcov.reportPaths": "coverage/lcovonly",
        },
    },
    () => process.exit()
);
