#!/usr/bin/env node

// Core libraries
const proc = require('./proc');

const create = require('./commands/create');
const help = require('./commands/help');
const show = require('./commands/show');
const status = require('./commands/status');

proc.stdout.write('Starting Asphalt...\n');

const commands = {
  create,
  help,
  show,
  status
};

const [command, schema, ...args] = proc.argv.slice(2);

if (commands[command]) {
  commands[command](schema, args);
} else {
  commands.help();
}
