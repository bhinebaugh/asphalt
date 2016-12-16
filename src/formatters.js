// Core libraries
const {Transform} = require('stream');

function formatterFactory(format) {
  return function formatter(props) {
    return new Transform({
      readableObjectMode: false,
      writableObjectMode: true,
      transform(chunk, enc, next) {
        if (chunk) {
          format(props, chunk, line => this.push(`${line}\n`));
        }
        next();
      }
    });
  };
}

function itemDetails(props, item, push) {
  const keys = props || Object.keys(item);
  keys.forEach(key => push(`${key}: ${item[key]}`));
}

function itemSummary(props, item, push) {
  const keys = props || Object.keys(item);
  const summary = keys.map(key => item[key]).join('\t');
  push(summary);
}

module.exports = {
  itemDetailFormatter: formatterFactory(itemDetails),
  itemSummaryFormatter: formatterFactory(itemSummary)
};
