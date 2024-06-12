export default {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended"
  ],
  ignorePatterns: ["vite.config.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: { "project": ["./tsconfig.json"] },
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "no-console": "error"
  }
}
