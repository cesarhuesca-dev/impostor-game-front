// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  {
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
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-empty-function": "error",

      "complexity": ["warn", 10],
      "default-case": "error",
      "no-empty": "error",
      "no-inner-declarations": "error",
      "no-case-declarations": "error",
      // "@angular-eslint/directive-selector": ["error",{type: "attribute",prefix: "app",style: "camelCase"}],
      // "@angular-eslint/component-selector": ["error",{type: "element",prefix: "app",style: "kebab-case"}],
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
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
]);
