const path = require("path");

module.exports = {
  projects: [
    {
      displayName: "server",
      preset: "ts-jest",
      testEnvironment: "node",
      roots: ["server"],
      setupFilesAfterEnv: [
        "./server/tests/setupTests.ts"
      ]
    },
    {
      displayName: "dom",
      transform: {
        "^.+\\.tsx?$": "ts-jest"
      },
      globals: {
        "ts-jest": {
          tsconfig: "tsconfig.jest.json"
        }
      },
      testEnvironment: "jsdom",
      moduleNameMapper: {
        "^.+\\.(css|less|scss)$": "identity-obj-proxy",
        "^@/(.*)$": path.join(__dirname, "src/$1"),
      },
      roots: ["src"],
      setupFilesAfterEnv: [
        "./src/setupTests.ts"
      ]
    }
  ]
};
