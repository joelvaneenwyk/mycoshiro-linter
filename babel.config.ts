// babel.config.ts
const config = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-proposal-private-methods'],
    ['import-glob'],
  ],
};

export default config;
