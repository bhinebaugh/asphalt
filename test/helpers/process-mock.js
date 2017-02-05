function noop() {}

const argv = [];

const stderr = {
  read: noop,
  write: noop
};
const stdout = {
  read: noop,
  write: noop
};

module.exports = {
  argv,
  stderr,
  stdout
};
