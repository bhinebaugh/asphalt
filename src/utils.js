// Core libraries
const fs = require('fs');
const path = require('path');
const proc = require('process');

// Asphalt modules
const {
  ARRAY_TYPE_REGEX,
  DEFAULT_CONFIG,
  TYPES
} = require('./constants');

function generateId() {
  return Math.random().toString(36).replace(/[\.\d]+/g, '').substring(0, 5);
}

function genericErrorHandler(err) {
  proc.stderr.write(JSON.stringify(err));
  proc.exit(1);
}

function getAsphaltConfig() {
  return new Promise((resolve, reject) => {
    fs.readFile('.asphalt.json', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(DEFAULT_CONFIG);
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

function serializePropType(type, value) {
  const isArrayType = ARRAY_TYPE_REGEX.test(type);
  const propType = isArrayType ? TYPES[type.match(ARRAY_TYPE_REGEX)[1]] : TYPES[type];
  const serialize = (propType && propType.serialize) || (val => val);

  if (isArrayType) {
    return value.map(val => serialize(val));
  }

  return serialize(value);
}

function assignPropType(type, value) {
  const isArrayType = ARRAY_TYPE_REGEX.test(type);
  const propType = isArrayType ? TYPES[type.match(ARRAY_TYPE_REGEX)[1]] : TYPES[type];
  const deserialize = (propType && propType.deserialize) || (val => val);

  if (isArrayType) {
    return [].concat(value).map(val => deserialize(val.trim())).filter(val => val);
  }

  return deserialize(value);
}

function assignElementPropTypes(schema, element) {
  return Object.keys(element).reduce((accumulator, prop) => {
    const next = {};
    next[prop] = assignPropType(schema[prop], element[prop]);
    return Object.assign({}, accumulator, next);
  }, {});
}

function getSavedElements(filepath, schema) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve([]);
        } else {
          reject(err);
        }
      } else {
        const data = JSON.parse(content).map(assignElementPropTypes.bind(this, schema));
        resolve(data);
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
  let config;
  let store;
  return getAsphaltConfig()
    .then(makeAsphaltDirectory)
    .then(result => (config = result))
    .then(populateElementStore)
    .then(result => (store = result))
    .then(result => ({config, store}));
}

module.exports = {
  assignElementPropTypes,
  assignPropType,
  generateId,
  genericErrorHandler,
  getAsphaltConfig,
  getSavedElements,
  initialize,
  makeAsphaltDirectory,
  populateElementStore,
  serializePropType
};
