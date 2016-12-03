// Core libraries
const proc = require('process');

const {
  genericErrorHandler,
  initialize
} = require('./utils');
const {
  createSchemaDefinitionStream,
  createSchemaPromptStream,
  createElementConsumer,
  saveElement
} = require('./commands/create');
const {
  createShowStream
} = require('./commands/show');
const {
  createStatusStream,
  createItemFormatter
} = require('./commands/status');

proc.stdout.write('Starting Asphalt...\n');
proc.stdout.write(`${proc.argv.join('\n')}\n\n`);

const commands = {
  create(schema) {
    initialize().then(init => {
      const {config, store} = init;
      createSchemaDefinitionStream(config.schema[schema])
        .pipe(createSchemaPromptStream())
        .pipe(createElementConsumer())
        .pipe(saveElement(config, schema, store[schema]));
    }).catch(genericErrorHandler);
  },
  help() {
    proc.stdout.write('TODO: Add usage example');
  },
  show(schema, args) {
    const [id] = args;
    initialize().then(init => {
      const {store} = init;
      createShowStream(store[schema], id)
        .pipe(createItemFormatter())
        .pipe(proc.stdout);
    }).catch(genericErrorHandler);
  },
  status(schema) {
    initialize().then(init => {
      const {store} = init;
      createStatusStream(store[schema])
        .pipe(createItemFormatter())
        .pipe(proc.stdout);
    }).catch(genericErrorHandler);
  }
};

const [command, schema, ...args] = proc.argv.slice(2);

if (commands[command]) {
  commands[command](schema, args);
} else {
  commands.help();
}
