const {defaultSchema} = require('../helpers/schema-fixtures');
const utils = require('../../src/utils');

describe('Utilities', () => {
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
});
