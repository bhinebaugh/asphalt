const mock = require('mock-require');
const {defaultSchema} = require('../helpers/schema-fixtures');
const processMock = require('../helpers/process-mock');

let utils;

describe('Utilities', () => {
  beforeAll(() => {
    mock('../../src/proc', processMock);
    utils = require('../../src/utils');
  });

  describe('assignElementPropTypes()', () => {
    beforeEach(() => {
      spyOn(utils, 'assignPropType');
    });

    it('returns a new object', () => {
      const element = {
        name: 'George'
      };
      const typedElement = utils.assignElementPropTypes(defaultSchema, element);
      expect(typedElement).not.toBe(element);
    });
  });

  describe('generateId()', () => {
    it('generates a five-character identifier', () => {
      expect(utils.generateId()).toMatch(/[a-z]{5}/);
    });
  });

  describe('genericErrorHandler', () => {
    it('includes the error text', () => {
      function triggerErrorHandler() {
        utils.genericErrorHandler({key: 'val'});
      }
      expect(triggerErrorHandler).toThrowError(/key: val/);
    });
  });

  afterAll(() => {
    mock.stop('process');
  });
});
