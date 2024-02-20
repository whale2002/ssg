import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: {
    index: 'src/node/index.ts',
    cli: 'src/node/cli.ts',
    dev: 'src/node/dev.ts'
  },
  clean: true,
  bundle: true,
  splitting: true,
  minify: process.env.NODE_ENV === 'production',
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  shims: true
})
