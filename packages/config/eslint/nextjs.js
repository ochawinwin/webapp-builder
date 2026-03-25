import { FlatCompat } from "@eslint/eslintrc";
import baseConfig from "./base.js";

const compat = new FlatCompat();

/** @type {import("typescript-eslint").Config} */
export default [
  ...baseConfig,
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
