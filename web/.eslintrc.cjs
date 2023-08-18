module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:import/recommended"
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "react",
  ],
  rules: {
    // indent: ["warn", "tab", { SwitchCase: 1 }],
    "linebreak-style": ["warn", "unix"],
    quotes: [
      "error",
      "double",
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    "max-len": ["error", { code: 120 }],
    "react/prop-types": 0,
    // "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-param-reassign": [2, { props: false }],
    "react/function-component-definition": [
      2,
      {
        namedComponents: ["arrow-function", "function-declaration"],
        unnamedComponents: "arrow-function",
      },
    ],
    "react/jsx-props-no-spreading": "off",
  },
};
