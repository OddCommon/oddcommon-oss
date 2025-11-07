export default {
  '*.{js,mjs,json,css,scss,md}': ['pnpm lint', 'pnpm format'],
  '**/*.ts?(x)': [() => 'pnpm check-types', 'pnpm lint', 'pnpm format'],
};
