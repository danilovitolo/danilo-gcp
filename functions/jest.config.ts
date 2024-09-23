export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
  testMatch: ["**/tests/**/*.test.ts"],
  coveragePathIgnorePatterns: ["node_modules", "<rootDir>/tests"],
  moduleDirectories: ["node_modules", "src"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
