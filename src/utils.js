// Core libraries
const fs = require('fs');

// Asphalt modules
const CONSTANTS = require('./constants');

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

module.exports = {
  getAsphaltConfig,
  getSavedElements
};
