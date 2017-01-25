const mock = require('mock-require');
const {defaultSchema} = require('../helpers/schema-fixtures');
const processMock = require('../helpers/process-mock');
const {DEFAULT_CONFIG} = require('../../src/constants');

let utils;

describe('Utilities', () => {
  beforeAll(() => {
    mock('../../src/proc', processMock);
    mock('fs', '../helpers/fs-mock');
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

  describe('assignPropType', () => {
    it('deserializes a string', () => {
      const string = utils.assignPropType('String', 'William');
      expect(string).toBe('William');
    });
    it('deserializes a number', () => {
      let number = utils.assignPropType('Number', '5');
      expect(number).toBe(5);

      number = utils.assignPropType('Number', 5);
      expect(number).toBe(5);
    });
    it('deserializes a date', () => {
      const date = utils.assignPropType('Date', '2017-01-01');
      expect(date instanceof Date).toBe(true);
    });
    it('deserializes an array of strings', () => {
      const strings = utils.assignPropType('[String]', ['William', 'Jefferson']);
      expect(strings).toEqual(['William', 'Jefferson']);
    });
    it('deserializes an array of numbers', () => {
      let numbers = utils.assignPropType('[Number]', ['1', '2']);
      expect(numbers).toEqual([1, 2]);

      numbers = utils.assignPropType('[Number]', [1, 2]);
      expect(numbers).toEqual([1, 2]);
    });
    it('deserializes an array of dates', () => {
      const dates = utils.assignPropType('[Date]', ['2017-01-01', '2017-01-02']);
      expect(dates instanceof Array).toBe(true);
      expect(dates[0] instanceof Date).toBe(true);
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

  describe('getAsphaltConfig', () => {
    it('returns a promise with the parsed configuration', () => {
      const promise = utils.getAsphaltConfig();
      expect(promise instanceof Promise).toBe(true);
    });
    describe('falls back to default configuration', () => {
      it('when a parse error occurs', () => {
        const promise = utils.getAsphaltConfig('.not.valid.json').then(data => {
          expect(data).toEqual(DEFAULT_CONFIG);
        });
      });
      it('when no configuration file is present', () => {
        const promise = utils.getAsphaltConfig('.not.a.file').then(data => {
          expect(data).toEqual(DEFAULT_CONFIG);
        });
      });
    });
    it('rejects the promise on error while loading the configuration', () => {
      const failSpy = jasmine.createSpy('failSpy');
      return utils.getAsphaltConfig('.other.error').catch(failSpy).then(() => {
        expect(failSpy).toHaveBeenCalled();
      });
    });
  });

  describe('makeAsphaltDirectory', () => {
    it('returns a promise that resolves with the given configuration');
    it('resolves correctly even if the directory already exists');
    it('rejects the promise if any other error occurs');
  });

  describe('serializePropType', () => {
    it('serializes a string');
    it('serializes a number');
    it('serializes a date');
    it('serializes an array of strings');
    it('serializes an array of numbers');
    it('serializes an array of dates');
  });

  afterAll(() => {
    mock.stop('fs');
    mock.stop('process');
  });
});
