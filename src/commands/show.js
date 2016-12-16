const proc = require('process');
const {Readable} = require('stream');

// Asphalt libraries
const {
  genericErrorHandler,
  initialize
} = require('../utils');
const {itemListingFormatter} = require('../formatters');

function createShowStream(items, match) {
  const filterFn = ('string' === typeof match) ? item => item.id === match : match;
  const filtered = items.filter(filterFn);
  return new Readable({
    objectMode: true,
    read() {
      this.push(filtered.shift() || null);
    }
  });
}

module.exports = function show(schema, args) {
  const [id] = args;
  initialize().then(init => {
    const {store} = init;
    createShowStream(store[schema], id)
      .pipe(itemListingFormatter())
      .pipe(proc.stdout);
  }).catch(genericErrorHandler);
};
