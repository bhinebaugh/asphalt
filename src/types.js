// External dependencies
const moment = require('moment');

const types = {
  Date: {
    deserialize: val => {
      const date = new Date(val);
      return isNaN(date.getTime()) ? null : date;
    },
    serialize: date => (date.toIsoString ? date.toISOString() : '')
  },
  Number: {
    deserialize: val => Number(val)
  },
  Semver: {
    validate: str => /\d+\.\d+\.\d+/.test(str)
  },
  String: {}
};

module.exports = types;
