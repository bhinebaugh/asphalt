const TYPES = {
  'Date': () => new Date(0),
  'Number': () => 0,
  'String': () => ''
};

const DEFAULT_CONFIG = {
  basePath: '.asphalt',
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
  }
};

module.exports = {
  TYPES,
  DEFAULT_CONFIG
};
