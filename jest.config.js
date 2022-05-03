console.log('loading jest.config.js file');
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  collectCoverage: true,
  coverageReporters: ['html'],
  coverageDirectory: 'coverage/my-app',
};
