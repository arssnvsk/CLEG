module.exports = {
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js'
  },
  resetMocks: false,
  setupFiles: ['jest-localstorage-mock']
}
