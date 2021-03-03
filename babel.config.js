module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', {
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
