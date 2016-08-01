// Core libraries
const fs = require('fs');
const proc = require('process');

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

// Imperative dumping ground
proc.stdout.write('Starting Asphalt...\n');

getAsphaltConfig().then(
  config => {
    proc.stdout.write(JSON.stringify(config))
    proc.stdout.write('\n');
  },
  err => {
    proc.stderr.write(JSON.stringify(err));
    proc.stderr.write('\n');
  }
);

