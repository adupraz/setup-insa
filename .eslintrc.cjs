require('@rushstack/eslint-patch/modern-module-resolution');

/** @type {import('eslint').ESLint.ConfigData}  */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  overrides: [
    {
      files: ['*.vue', '*.ts'],
      extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        '@vue/eslint-config-airbnb-with-typescript',
      ],
      plugins: [
        'simple-import-sort',
      ],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
      },
      rules: {
        // Eslint rules
        'no-console': 'error',
        // 'no-param-reassign': 'off',

        // Plugins rules
        'import/prefer-default-export': 'off',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/order': 'off',
        'simple-import-sort/imports': ['error', {
          groups: [
            // Node.js builtins prefixed with `node:`.
            // Packages, things that start with a letter (or digit or underscore), or `@` followed by a letter.
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ['^node:', '^@?\\w', '^'],
            // Relative imports.
            // Anything that starts with a dot.
            ['^\\.'],
            // Side effect imports.
            ['^\\u0000'],
          ],
        }],
        'simple-import-sort/exports': 'error',

        // TypeScript rules
        // https://typescript-eslint.io/rules/#extension-rules
        '@typescript-eslint/array-type': ['error', {
          default: 'array',
        }],
        '@typescript-eslint/ban-types': 'error',
        '@typescript-eslint/consistent-type-imports': ['error', {
          fixStyle: 'inline-type-imports',
        }],
        '@typescript-eslint/member-delimiter-style': 'error',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'error',

        // Vue rules
        'vue/max-attributes-per-line': ['error', {
          singleline: 1,
          multiline: 1,
        }],
        'vue/max-len': ['error', 120, 2, {
          ignoreUrls: true,
          ignoreComments: false,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreHTMLAttributeValues: true,
          ignoreHTMLTextContents: false,
        }],
        'vue/no-multiple-template-root': 'off',
        'vue/html-closing-bracket-spacing': ['error', {
          startTag: 'never',
          endTag: 'never',
          selfClosingTag: 'never',
        }],
      },
    },
    {
      files: ['*.*js'],
      extends: ['@vue/eslint-config-airbnb'],
      rules: { 'vue/max-len': ['error', 120] },
    },
    {
      files: [
        // These pages are not used directly by users, so they can have one-word names.
        '**/pages/**/*.{js,ts,jsx,tsx,vue}',
        '**/layouts/**/*.{js,ts,jsx,tsx,vue}',
        '**/app.{js,ts,jsx,tsx,vue}',
        '**/error.{js,ts,jsx,tsx,vue}',
        // These files should have multiple words in their names as they are within subdirectories.
        '**/components/*/**/*.{js,ts,jsx,tsx,vue}',
      ],
      rules: { 'vue/multi-word-component-names': 'off' },
    },
    {
      // Pages and layouts are required to have a single root element if transitions are enabled.
      files: ['**/pages/**/*.{js,ts,jsx,tsx,vue}', '**/layouts/**/*.{js,ts,jsx,tsx,vue}'],
      rules: { 'vue/no-multiple-template-root': 'error' },
    },
  ],
  reportUnusedDisableDirectives: true,
};
