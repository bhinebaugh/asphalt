const {Readable} = require('stream');

const proc = require('../proc');

// Asphalt libraries
const initialize = require('../init');
const {genericErrorHandler} = require('../utils');
const {itemDetailFormatter} = require('../formatters');

function createShowStream(items = [], match) {
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
    const {config, store} = init;
    createShowStream(store[schema], id)
      .pipe(itemDetailFormatter(Object.keys(config.schema[schema])))
      .pipe(proc.stdout);
  }).catch(genericErrorHandler);
};
