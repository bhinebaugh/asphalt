// External dependencies
const moment = require('moment');
const {
  ID_REGEX,
  ISO_8601_REGEX,
  SEMVER_REGEX
} = require('./constants');

const echo = val => val;

const types = {
  Boolean: {
    deserialize: val => !!val,
    serialize: echo,
    validate: val => [true, false].includes(val)
  },
  Date: {
    deserialize: val => (ISO_8601_REGEX.test(val) ? moment(val) : ''),
    serialize: date => (date && date.format ? date.format() : ''),
    validate: val => ISO_8601_REGEX.test(val)
  },
  ID: {
    deserialize: echo,
    serialize: echo,
    validate: val => ID_REGEX.test(val)
  },
  Number: {
    deserialize: val => Number(val),
    serialize: echo,
    validate: val => 'number' === typeof val && !isNaN(val)
  },
  Semver: {
    deserialize: val => {
      const [major, minor, patch] = [].concat(val.match(SEMVER_REGEX))
        .slice(1)
        .map(str => Number(str));
      return {major, minor, patch};
    },
    serialize: val => `${val.major}.${val.minor}.${val.patch}`,
    validate: val => SEMVER_REGEX.test(val)
  },
  String: {
    deserialize: val => String(val),
    serialize: echo,
    validate: val => 'string' === typeof val
  }
};

module.exports = types;
