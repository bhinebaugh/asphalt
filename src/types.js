// External dependencies
const moment = require('moment');

const types = {
  Boolean: {
    deserialize: val => !!val,
    serialize: val => !!val,
    validate: val => [true, false].includes(val)
  },
  Date: {
    deserialize: val => {
      const date = new Date(val);
      return isNaN(date.getTime()) ? null : date;
    },
    serialize: date => (date.toISOString ? date.toISOString() : '')
  },
  Number: {
    deserialize: val => Number(val),
    serialize: val => Number(val),
    validate: val => !isNaN(Number(val))
  },
  Semver: {
    deserialize: val => {
      const [major, minor, patch] = [].concat(val.match(/^(\d+)\.(\d+)\.(\d+)/))
        .slice(1)
        .map(str => Number(str));
      return {major, minor, patch};
    },
    serialize: val => `${val.major}.${val.minor}.${val.patch}`,
    validate: val => /^\d+\.\d+\.\d+/.test(val)
  },
  String: {
    deserialize: val => String(val),
    serialize: val => String(val),
    validate: val => 'string' === typeof val
  }
};

module.exports = types;
