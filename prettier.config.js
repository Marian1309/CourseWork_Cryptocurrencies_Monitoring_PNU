/** @type {import('prettier').Config} */

const prettierConfig = {
  printWidth: 90,
  trailingComma: 'none',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  arrowParens: 'always',
  useTabs: false,
  quoteProps: 'as-needed',
  bracketSameLine: false,
  insertPragma: false,
  bracketSpacing: true,
  proseWrap: 'always',
  requirePragma: false,
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',

    '^@/types/(.*)$',

    '^@/db',
    '^@actions/(.*)$',

    '^@/constants$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/context/(.*)$',
    '^@/schemas/(.*)$',
    '^@/services/(.*)$',

    '^@/components/(.*)$',
    '^@/components/ui/(.*)$',
    '^./ui/(.*)$',

    '^@/(.*)$',
    '^../(.*)$',
    '^./providers$',
    '^./(.*)$'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss']
};

module.exports = prettierConfig;
