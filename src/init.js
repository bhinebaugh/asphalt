// Asphalt dependencies
const {
  getAsphaltConfig,
  makeAsphaltDirectory,
  populateElementStore
} = require('./utils');

let config;
let schema;
let store;

const configPromise = getAsphaltConfig()
  .then(makeAsphaltDirectory)
  .then(result => (config = result))
  .then(populateElementStore)
  .then(result => (store = result));

module.exports = function initialize(nextSchema) {
  if (!schema) {
    schema = nextSchema;
  }
  return configPromise.then(result => ({config, schema, store}));
};
