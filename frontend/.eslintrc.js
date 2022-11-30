module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
    createDefaultProgram: true,
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "prettier/prettier": ["warn", { endOfLine: "auto" }],
    "react/require-default-props": "off",
    "react/no-array-index-key": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "react/function-component-definition": [
      "warn",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
    "import/order": [
      "error",
      {
        groups: [
          ["external", "builtin"],
          "internal",
          "sibling",
          "parent",
          "index",
        ],
        "newlines-between": "always-and-inside-groups",
        alphabetize: {
          order: "asc",
        },
      },
    ],
  },
  ignorePatterns: ["build/*"],
};
