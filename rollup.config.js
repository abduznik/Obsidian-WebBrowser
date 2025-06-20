import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'main.ts',
  output: {
    dir: '.',
    format: 'cjs',
    sourcemap: false
  },
  external: ['obsidian'],
  plugins: [typescript()]
};
