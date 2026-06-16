import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default defineConfig(
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.mts", "**/*.cts"],
    plugins: {
      playwright,
    },
    rules: {
      "playwright/missing-playwright-await": "error",
      "playwright/no-conditional-in-test": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "test-results/**",
      "playwright-report/**",
      "allure-results/**",
    ],
  },
);
