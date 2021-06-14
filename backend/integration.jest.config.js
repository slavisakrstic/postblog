module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageReporters: ["html", "lcov", "text"],
  testRegex: "(spec|test).ts$",
  rootDir: ".",
  verbose: true,
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.integration-test.json",
    },
  },
};
