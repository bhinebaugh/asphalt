const proc = require('process');
const {Readable} = require('stream');

// Asphalt libraries
const {
  genericErrorHandler,
  initialize
} = require('../utils');
const {itemDetailFormatter} = require('../formatters');

function createShowStream(items, match) {
  const filterFn = ('function' === typeof match) ? match : item => item.id === match;
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
      .pipe(itemDetailFormatter())
      .pipe(proc.stdout);
  }).catch(genericErrorHandler);
};