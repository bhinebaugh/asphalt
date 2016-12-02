// Core libraries
const fs = require('fs');
const path = require('path');
const proc = require('process');
const readline = require('readline');
const {
  Readable,
  Transform,
  Writable
} = require('stream');

// Third party libraries
const Promise = require('promise');

// Convert schema into a stream of [name, type] pairs
function createSchemaDefinitionStream(schema) {
  const schemaPairs = Object.keys(schema).map(name => ({name, type: schema[name]}));
  return new Readable({
    objectMode: true,
    read() {
      this.push(schemaPairs.shift() || null);
    }
  });
}

// Consume schema stream and prompt user for input
function createSchemaPromptStream() {
  return new Transform({
    objectMode: true,
    transform(chunk, enc, next) {
      const {name, type} = chunk;
      const rl = readline.createInterface({
        input: proc.stdin,
        output: proc.stdout
      });

      rl.question(`${name} (${type}): `, value => {
        rl.close();
        const result = Object.assign({}, chunk, {value});
        this.push(result);
        next();
      });
    }
  });
}

// Consume user input and write created object stream
function createElementConsumer() {
  const result = {};
  return new Transform({
    objectMode: true,
    transform(chunk, enc, next) {
      const {name, type, value} = chunk;
      result[name] = value;
      this.push(result);
      next();
    }
  });
}

// Handle the resulting created object
function saveElement(config, name, branch) {
  const filepath = path.resolve(config.basePath, `${name}.json`);
  let latest;

  return new Writable({
    objectMode: true,
    write(chunk, enc, next) {
      latest = chunk;
      next();
    }
  }).on('finish', () => {
    const modifiedBranch = branch.concat(latest);
    fs.writeFile(filepath, JSON.stringify(modifiedBranch) + '\n', err => {
      if (err) {
        proc.stderr.write(`An error occurred saving your ${name} change: ${err}`);
      }
    });
  });
}

module.exports = {
  createSchemaDefinitionStream,
  createSchemaPromptStream,
  createElementConsumer,
  saveElement
};
