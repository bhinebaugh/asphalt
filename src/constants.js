const ARRAY_TYPE_REGEX = /^\[(\w+)\]$/;

const TYPES = {
  Date: {
    deserialize: val => {
      const date = new Date(val);
      return isNaN(date.getTime()) ? '' : date;
    },
    serialize: date => (date.toISOString ? date.toISOString() : '')
  },
  Number: {
    deserialize: val => Number(val)
  },
  Semver: {
    validate: str => /\d+\.\d+\.\d+/.test(str)
  },
  String: {}
};

/*
* The configuration object needs to specify the following things related to saved data:
*  1. the schema of each property data type
*  2. which properties to display in which context
*  3. and what string format to use on each property (in each context).
*  4. how to sort the items results
* TODO Revise the format config to suit the needs stated above
*/

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
    feature: ['id', 'title', 'started', 'completed']
  }
};

module.exports = {
  ARRAY_TYPE_REGEX,
  TYPES,
  DEFAULT_CONFIG
};
