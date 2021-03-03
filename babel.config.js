module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', {
      // Transform syntax issues in buggy implemenetations, instead of providing polyfills in those
      // cases. See https://babeljs.io/blog/2020/03/16/7.9.0#babelpreset-envs-bugfixes-option-11083httpsgithubcombabelbabelpull11083.
      bugfixes: true,
      // Turn on "shipped proposals", which gives us access to non-stage4 proposals that have
      // nevertheless shipped in multiple browsers. The main proposal we need support for is
      // public class properties.
      // See https://babeljs.io/docs/en/babel-preset-env#shippedproposals.
      shippedProposals: true,
    }],
  ],
  overrides: [
    {
      include: 'demo',
      presets: ['@babel/preset-react'],
    },
  ],
};
