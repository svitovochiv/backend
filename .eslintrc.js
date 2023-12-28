module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
    plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': ['error',{
      'endOfLine': 'auto'}
    ],
    "import/no-unresolved": "error",
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "parent",
          "type",
          "index",
          "sibling",
          "internal",
          "object",

        ]
      }
    ],
    "no-unused-vars": ["error", {
      "varsIgnorePattern": "^unused"
    }]

  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

        // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

        // // use <root>/path/to/folder/tsconfig.json
        // project: "path/to/folder",
        //
        // // Multiple tsconfigs (Useful for monorepos)
        //
        // // use a glob pattern
        // project: "packages/*/tsconfig.json",
        //
        // // use an array
        // project: [
        //   "packages/module-a/tsconfig.json",
        //   "packages/module-b/tsconfig.json"
        // ],
        //
        // // use an array of glob patterns
        // "project": [
        //   "packages/*/tsconfig.json",
        //   "other-packages/*/tsconfig.json"
        // ]
      }
    }
  }
};
