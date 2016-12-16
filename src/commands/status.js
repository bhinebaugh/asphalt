// Core libraries
const proc = require('process');
const {
  Readable,
  Transform
} = require('stream');

// Asphalt libraries
const {
  genericErrorHandler,
  initialize
} = require('../utils');
const {itemListingFormatter} = require('../formatters');

function createStatusStream(items) {
  return new Readable({
    objectMode: true,
    read() {
      this.push(items.shift() || null);
    }
  });
}

module.exports = {
  createStatusStream
};

module.exports = function status(schema) {
  initialize().then(init => {
    const {store} = init;
    createStatusStream(store[schema])
      .pipe(itemListingFormatter())
      .pipe(proc.stdout);
  }).catch(genericErrorHandler);
};
