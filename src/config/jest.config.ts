export default {
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  maxWorkers: '80%',
  collectCoverageFrom: ['<rootDir>/src/services/*.ts', '<rootDir>/src/models/*.ts', '!<rootDir>/node_modules/'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      branch: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
};
