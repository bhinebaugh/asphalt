// Core libraries
const proc = require('process');
const {
  Readable,
  Transform
} = require('stream');

// Asphalt libraries
const initialize = require('../init');
const {genericErrorHandler} = require('../utils');
const {itemSummaryFormatter} = require('../formatters');

function createStatusStream(items) {
  return new Readable({
    objectMode: true,
    read() {
      this.push(items.shift() || null);
    }
  });
}

module.exports = function status(schema, args) {
  initialize().then(init => {
    const {config, store} = init;
    const format = (config.format[schema] || {}).status || config.format[schema];
    createStatusStream(store[schema])
      .pipe(itemSummaryFormatter(format))
      .pipe(proc.stdout);
  }).catch(genericErrorHandler);
};
