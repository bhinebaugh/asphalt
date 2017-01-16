module.exports = {
  globals: {
    'afterAll': false,
    'afterEach': false,
    'beforeAll': false,
    'beforeEach': false,
    'describe': false,
    'expect': false,
    'it': false,
    'jasmine': false,
    'spyOn': false
  },
  rules: {
    'global-require': 'off',
    'import/no-extraneous-dependencies': ['error', {devDependencies: true}]
  }
};
