module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testMatch: ['**/tests/unit/**/*.test.js'],
  moduleFileExtensions: ['js', 'jsx'],
};
