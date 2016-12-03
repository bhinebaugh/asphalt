const {Readable} = require('stream');

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

module.exports = {
  createShowStream
};
