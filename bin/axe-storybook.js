#!/usr/bin/env node

require('../build/index.js')
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
