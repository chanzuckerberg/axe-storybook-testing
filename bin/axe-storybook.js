#!/usr/bin/env node

// eslint-disable-next-line import/extensions
require('../build/index')
  .run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    if (error) {
      console.log(error);
    }
    process.exit(1);
  });
