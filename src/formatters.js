// Core libraries
const {Transform} = require('stream');

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
  createItemFormatter
};
