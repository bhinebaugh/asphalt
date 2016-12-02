// Core libraries
const fs = require('fs');
const path = require('path');
const proc = require('process');
const {
  Readable,
  Transform
} = require('stream');

// Third party libraries
const Promise = require('promise');

// Asphalt modules
const {
  getAsphaltConfig,
  populateElementStore
} = require('./utils');

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
      const {title, started, completed} = chunk;
      this.push(`${title}\t${started}\t${completed}\n`);
      next();
    }
  });
}

function writeOut() {
  return new Writable({
    write(chunk, enc, next) {
      proc.stdout.write(chunk);
    }
  });
}

module.exports = {
  createStatusStream,
  createItemFormatter,
  writeOut
};
