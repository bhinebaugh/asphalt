// Core libraries
const fs = require('fs');
const proc = require('process');
const Readable = require('stream').Readable;
const Transform = require('stream').Transform;
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

// Convert schema into a stream of [name, type] pairs
class SchemaDefinitionStream extends Readable {
  constructor(schema, options = {}) {
    options.objectMode = true;
    const stream = super(options);
    stream.schemaPairs = Object.keys(schema).map(name => [name, schema[name]]);
    return stream;
  }

  _read() {
    this.push(this.schemaPairs.shift() || null);
  }
}

function createSchemaDefinitionStream(schema) {
  const schemaPairs = Object.keys(schema).map(name => [name, schema[name]]);
  return new Readable({
    objectMode: true,
    read: function ()  {
      this.push(schemaPairs.shift() || null);
    }
  });
}

// Consume schema stream and prompt user for input
class SchemaPromptStream extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    return super(options);
  }

  _transform(chunk, enc, next) {
    const [name, type] = chunk;
    const rl = readline.createInterface({
      input: proc.stdin,
      output: proc.stdout
    });

    rl.question(`${name} [${type}]: `, (value) => {
      rl.close();
      this.push(value);
      next();
    });
  }
}

function createSchemaPromptStream () {
  return new Transform({
    objectMode: true,
    transform: function (chunk, enc, next) {
      const [name, type] = chunk;
      const rl = readline.createInterface({
        input: proc.stdin,
        output: proc.stdout
      });

      rl.question(`${name} [${type}]: `, (value) => {
        rl.close();
        this.push(value);
        next();
      });
    }
  });
}

// Consume user input and write created object stream

// Handle the resulting created object


// Imperative dumping ground
proc.stdout.write('Starting Asphalt...\n');

getAsphaltConfig().then(
  config => {
    createSchemaDefinitionStream(config.schema.feature)
      .pipe(createSchemaPromptStream())
      .pipe(proc.stdout);
  },
  err => {
    proc.stderr.write(JSON.stringify(err));
    proc.exit(1);
  }
);

