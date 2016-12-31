const proc = require('process');
const initialize = require('../init');
const {genericErrorHandler} = require('../utils');

module.exports = function help(schema, args) {
  return initialize().then(init => {
    proc.stdout.write('TODO: Add usage example\n');
  }).catch(genericErrorHandler);
};
