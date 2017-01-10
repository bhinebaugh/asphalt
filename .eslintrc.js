module.exports = {
  extends: 'airbnb',
  plugins: [
    'react',
    'jsx-a11y',
    'import'
  ],
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'never'],
    'func-names': 'off',
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    'object-curly-spacing': ['error', 'never'],
    'yoda': 'off'
  }
};
