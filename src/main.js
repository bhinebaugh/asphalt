// Core libraries
const proc = require('process');

// Third party libraries
const Promise = require('promise');

// Asphalt modules
const CONSTANTS = require('./constants');
const {
  genericErrorHandler,
  initialize
} = require('./utils');
const {
  createSchemaDefinitionStream,
  createSchemaPromptStream,
  createElementConsumer,
  saveElement
} = require('./create');
const {
  createStatusStream,
  createItemFormatter,
  writeOut
} = require('./status');

proc.stdout.write('Starting Asphalt...\n');

console.log(proc.argv);

const commands = {
  create: function (schema) {
    initialize().then(init => {
      const {config, store} = init;
      createSchemaDefinitionStream(config.schema[schema])
        .pipe(createSchemaPromptStream())
        .pipe(createElementConsumer())
        .pipe(saveElement(config, schema, store[schema]));
    }).catch(genericErrorHandler);
  },
  help: function () {
    proc.stdout.write('TODO: Add usage example');
  },
  status: function (schema) {
    initialize().then(init => {
      const {config, store} = init;
      createStatusStream(store[schema])
        .pipe(createItemFormatter())
        .pipe(proc.stdout);
    }).catch(genericErrorHandler);
  }
};

const [execPath, scriptPath, command, schema, ...args] = proc.argv;

commands[command] ? commands[command](schema, args) : commands.help();

