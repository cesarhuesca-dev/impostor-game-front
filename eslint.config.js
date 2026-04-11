const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  {
    ignores: ['.angular/**', '.nx/**', 'coverage/**', 'dist/**'],
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      eslintPluginPrettierRecommended
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Angular best practices
      // '@angular-eslint/directive-selector': [ 'error', { type: 'attribute', prefix: 'app', style: 'camelCase',},],
      // '@angular-eslint/component-selector': [ 'error', { type: ['attribute', 'element'], prefix: 'app', style: 'kebab-case',},],
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/prefer-output-readonly': 'warn',
      '@angular-eslint/prefer-signals': 'warn',

      // TypeScript best practices
      '@typescript-eslint/array-type': ['warn'],
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-shadow': 'warn',
      // '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      // '@typescript-eslint/explicit-function-return-type': 'error',

      // JavaScript best practices
      eqeqeq: 'error',
      complexity: ['error', 20],
      'no-bitwise': 'error',
      'no-new-wrappers': 'error',
      'no-useless-concat': 'error',
      'no-var': 'error',
      'no-shadow': 'error',
      'one-var': ['error', 'never'],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'error',
      // 'no-console': 'warn',
      // 'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true, allowSeparatedGroups: true,},],

      // Security
      'no-eval': 'error',
      'no-implied-eval': 'error',

      //Prettier
      "prettier/prettier": [ "error",
        {
          "useTabs": false,
          "bracketSameLine": true,
          "endOfLine": "auto",
          "singleQuote": true,
          "semi": true,
          "trailingComma": "all",
          "printWidth": 150,
          "tabWidth": 2,
          "arrowParens": "always",
          "bracketSpacing": true
        }
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      // angular.configs.templateAccessibility,
    ],
    rules: {
      // Angular template best practices
      '@angular-eslint/template/button-has-type': 'warn',
      '@angular-eslint/template/cyclomatic-complexity': ['warn', { maxComplexity: 20 }],
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'warn',
      '@angular-eslint/template/prefer-self-closing-tags': 'warn',
      '@angular-eslint/template/use-track-by-function': 'warn',
    }
  }
]);
