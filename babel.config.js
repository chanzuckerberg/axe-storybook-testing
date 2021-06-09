module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env',
  ],
  overrides: [
    {
      include: 'demo',
      presets: ['@babel/preset-react'],
    },
  ],
};
