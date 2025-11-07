import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs', 'module'],
  dts: true,
  clean: true,
  sourcemap: true,
  ignoreWatch: ['./.turbo', './dist', './node_modules'],
});
