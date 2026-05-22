import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: true,
          fixStyle: "separate-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-namespace": "off",
      "import/consistent-type-specifier-style": [
        "error",
        "prefer-top-level",
      ],
      "object-curly-newline": [
        "error",
        {
          ExportDeclaration: {
            minProperties: 4,
            multiline: true,
          },
          ImportDeclaration: {
            minProperties: 4,
            multiline: true,
          },
        },
      ],
      "object-curly-spacing": ["error", "always"],
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            [
              "^react$",
              "^react-dom",
              "^@?\\w",
              "^@/",
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
              "^.*\\u0000$",
              "^\\u0000",
              "^.+\\.(css|scss|sass|less)$",
            ],
          ],
        },
      ],
    },
  },
];

export default config;
