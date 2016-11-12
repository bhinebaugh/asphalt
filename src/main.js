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

// Asphalt modules
const CONSTANTS = require('./constants');
const {getAsphaltConfig} = require('./utils');
const {
  populateElementStore,
  createSchemaDefinitionStream,
  createSchemaPromptStream,
  createElementConsumer,
  saveElement
} = require('./create');

proc.stdout.write('Starting Asphalt...\n');

console.log(proc.argv);

getAsphaltConfig().then(config => {
  fs.mkdir(config.basePath, err => {
    populateElementStore(config).then(store => {
      createSchemaDefinitionStream(config.schema.feature)
        .pipe(createSchemaPromptStream())
        .pipe(createElementConsumer())
        .pipe(saveElement(config, 'feature', store.feature));
    });
  });
}).catch(err => {
  proc.stderr.write(JSON.stringify(err));
  proc.exit(1);
});
