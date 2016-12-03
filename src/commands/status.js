// Core libraries
const {
  Readable,
  Transform
} = require('stream');

function createStatusStream(items) {
  return new Readable({
    objectMode: true,
    read() {
      this.push(items.shift() || null);
    }
  });
}

function createItemFormatter() {
  return new Transform({
    readableObjectMode: false,
    writableObjectMode: true,
    transform(chunk, enc, next) {
      if (chunk) {
        Object.keys(chunk).forEach(element => {
          this.push(`${element}: ${chunk[element]}\n`);
        });
      }
      next();
    }
  });
}

module.exports = {
  createStatusStream,
  createItemFormatter
};
