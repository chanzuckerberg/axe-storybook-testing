module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', {
      targets: {
        node: 10,
      },
    }],
  ],
  overrides: [
    {
      include: 'demo',
      presets: ['@babel/preset-react'],
    },
  ],
};
