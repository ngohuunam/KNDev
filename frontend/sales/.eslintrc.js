module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],

  rules: {
    'arrow-parens': [2, 'as-needed', { requireForBlockBody: false }],
    // 'space-before-function-paren': ['error', 'always'],
    // "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
