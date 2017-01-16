function noop() {}

const stderr = {
  read: noop,
  write: noop
};
const stdout = {
  read: noop,
  write: noop
};

module.exports = {
  stderr,
  stdout
};
