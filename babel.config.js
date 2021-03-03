module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env',
  ],
  'plugins': [
    // We need to turn on class properties because we support Node 10. Normally we'd do that
    // through preset-env, but we also need to configure loose transformations, and I didn't want
    // to configure that for all plugins.
    //
    // We need loose transformations because some code gets executed in the browser via Playwright,
    // instead of Node. The code executing in browser needs to be standlone, and class properties
    // must be compiled to assignment, instead of `defineProperty`.
    //
    // If and when we go from supporting Node 10 to Node 12, delete this.
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
  overrides: [
    {
      include: 'demo',
      presets: ['@babel/preset-react'],
    },
  ],
};
