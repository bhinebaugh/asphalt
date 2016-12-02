// Core libraries
const fs = require('fs');
const path = require('path');
const proc = require('process');

// Asphalt modules
const CONSTANTS = require('./constants');

function genericErrorHandler(err) {
  proc.stderr.write(JSON.stringify(err));
  proc.exit(1);
}

function getAsphaltConfig() {
  return new Promise((resolve, reject) => {
    fs.readFile('.asphalt.json', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
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

function makeAsphaltDirectory(config) {
  return new Promise((resolve, reject) => {
    fs.mkdir(config.basePath, err => {
      resolve(config);
    });
  });
}

function getSavedElements(filepath, schema) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
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
    return getSavedElements(filepath, config.schema[name]).then(elements => {
      store[name] = elements;
    });
  });

  return Promise.all(promises).then(() => store).catch(err => proc.stderr.write(err));
}

function initialize() {
  let config, store;
  return getAsphaltConfig()
    .then(makeAsphaltDirectory)
    .then(result => config = result)
    .then(populateElementStore)
    .then(result => store = result)
    .then(result => {
      return {config, store}
    });
}

module.exports = {
  genericErrorHandler,
  getAsphaltConfig,
  getSavedElements,
  initialize,
  makeAsphaltDirectory,
  populateElementStore
};
