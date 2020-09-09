module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 12,
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
