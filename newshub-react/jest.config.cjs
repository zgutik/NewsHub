module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass|module\\.css)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx}',
    'src/utils/**/*.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60,
    },
    './src/utils/': {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};