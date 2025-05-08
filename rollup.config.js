import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    dir: '.',
    format: 'cjs'
  },
  external: ['obsidian', 'fs', 'path'],
  plugins: [typescript()]
};
