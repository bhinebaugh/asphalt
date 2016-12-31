const ARRAY_TYPE_REGEX = /^\[(\w+)\]$/;

const TYPES = {
  Date: {
    deserialize: val => {
      const date = new Date(val);
      return isNaN(date.getTime()) ? '' : date;
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

const DEFAULT_CONFIG = {
  basePath: '.asphalt',
  indent: 2,
  schema: {
    feature: {
      title: 'String',
      description: 'String',
      acceptance: '[String]',
      started: 'Date',
      completed: 'Date'
    },
    milestone: {
      version: 'Semver',
      title: 'String',
      description: 'String'
    }
  },
  format: {
    feature: ['title', 'started', 'completed']
  }
};

module.exports = {
  ARRAY_TYPE_REGEX,
  TYPES,
  DEFAULT_CONFIG
};
