// Core libraries
const fs = require('fs');
const path = require('path');
const proc = require('process');
const Readable = require('stream').Readable;
const Transform = require('stream').Transform;
const Writable = require('stream').Writable;
const readline = require('readline');

// Third party libraries
const Promise = require('promise');
const CONSTANTS = require('./constants');

// Functional programming haven
function getAsphaltConfig() {
  return new Promise((resolve, reject) => {
    fs.readFile('.asphalt.json', (err, data) => {
      if (err) {
        if ('ENOENT' === err.code) {
          resolve(CONSTANTS.DEFAULT_CONFIG);
        } else {
          reject(err);
        }
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

function getSavedElements(filepath, schema) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, data) => {
      if (err) {
        if ('ENOENT' === err.code) {
          resolve([]);
        } else {
          reject(err);
        }
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

function populateElementStore(config) {
    const store = {};

    const promises = Object.keys(config.schema).map(name => {
      const filepath = path.resolve(config.basePath, `${name}.json`);
      return getSavedElements(filepath, config.schema[name])
        .then(elements => store[name] = elements);
    });

    return Promise.all(promises).then(() => {
      console.log(store);
      return store;
    }, (err) => {
      console.log(err);
    });
}

// Convert schema into a stream of [name, type] pairs
function createSchemaDefinitionStream(schema) {
  const schemaPairs = Object.keys(schema).map(name => {
    return {name, type: schema[name]}
  });
  return new Readable({
    objectMode: true,
    read: function ()  {
      this.push(schemaPairs.shift() || null);
    }
  });
}

// Consume schema stream and prompt user for input
function createSchemaPromptStream () {
  return new Transform({
    objectMode: true,
    transform: function (chunk, enc, next) {
      const {name, type} = chunk;
      const rl = readline.createInterface({
        input: proc.stdin,
        output: proc.stdout
      });

      rl.question(`${name} (${type}): `, (value) => {
        rl.close();
        const result = Object.assign({}, chunk, {value});
        this.push(result);
        next();
      });
    }
  });
}

// Consume user input and write created object stream
function createElementConsumer(){
  const result = {};
  return new Transform({
    objectMode: true,
    transform: function (chunk, enc, next) {
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
    write: function (chunk, enc, next) {
      latest = chunk;
      next();
    }
  }).on('finish', () => {
    const modifiedBranch = branch.concat(latest);
    fs.writeFile(filepath, JSON.stringify(modifiedBranch), (err, data) => {
      console.log('done?', err);
    });
  });
}

// Imperative dumping ground
proc.stdout.write('Starting Asphalt...\n');

getAsphaltConfig().then(
  config => {
    fs.mkdir(config.basePath, (err) => {
      if (err) {
        proc.stderr.write(String(err));
      }
      populateElementStore(config).then(store => {
        createSchemaDefinitionStream(config.schema.feature)
          .pipe(createSchemaPromptStream())
          .pipe(createElementConsumer())
          .pipe(saveElement(config, 'feature', store.feature));
      });
    });
  },
  err => {
    proc.stderr.write(JSON.stringify(err));
    proc.exit(1);
  }
);

