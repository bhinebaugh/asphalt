const mock = require('mock-require');
const {defaultSchema} = require('../helpers/schema-fixtures');
const {DEFAULT_CONFIG} = require('../../src/constants');

let utils;

describe('Utilities', () => {
  beforeAll(() => {
    mock('../../src/proc', '../helpers/process-mock');
    mock('fs', '../helpers/fs-mock');
    mock('path', '../helpers/path-mock');
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
    it('returns a promise with the parsed configuration', done => {
      utils.getAsphaltConfig().then(config => {
        expect(config.foo).toBe('bar');
        done();
      });
    });
    describe('falls back to default configuration', () => {
      it('when a parse error occurs', done => {
        utils.getAsphaltConfig('not.valid.json').then(data => {
          expect(data).toEqual(DEFAULT_CONFIG);
          done();
        });
      });
      it('when no configuration file is present', done => {
        utils.getAsphaltConfig('not.a.file').then(data => {
          expect(data).toEqual(DEFAULT_CONFIG);
          done();
        });
      });
    });
    it('rejects the promise on error while loading the configuration', done => {
      const failSpy = jasmine.createSpy('failSpy');
      utils.getAsphaltConfig('other.error').catch(failSpy).then(() => {
        expect(failSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('getSavedElements', () => {
    const schema = {id: 'String'};
    it('returns a promise that resolves with saved items array', done => {
      utils.getSavedElements('feature.json', schema).then(elements => {
        expect(elements instanceof Array).toBe(true);
        expect(elements.length).toBe(2);
        expect(elements[0]).toEqual({id: 'alpha'});
        done();
      });
    });
    it('resolves with an empy array if no file exists', done => {
      utils.getSavedElements('not.a.file', schema).then(elements => {
        expect(elements instanceof Array).toBe(true);
        expect(elements.length).toBe(0);
        done();
      });
    });
    it('rejects the promise on any other error', done => {
      const failSpy = jasmine.createSpy('failSpy');
      return utils.getSavedElements('other.error', schema).catch(failSpy).then(() => {
        expect(failSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('makeAsphaltDirectory', () => {
    it('returns a promise that resolves with the given configuration', done => {
      const config = {basePath: '.asphalt'};
      utils.makeAsphaltDirectory(config).then(conf => {
        expect(conf.basePath).toBe('.asphalt');
        done();
      });
    });
    it('resolves correctly even if the directory already exists', done => {
      const config = {basePath: '.asphalt.duplicate'};
      utils.makeAsphaltDirectory(config).then(conf => {
        expect(conf).toBe(config);
        done();
      });
    });
    it('rejects the promise if any other error occurs', done => {
      const failSpy = jasmine.createSpy('failSpy');
      const config = {basePath: 'other.error'};
      return utils.makeAsphaltDirectory(config).catch(failSpy).then(() => {
        expect(failSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('populateElementStore', () => {
    it('returns a promise that resolves with a populated store', done => {
      const config = {
        schema: {
          feature: {
            id: 'String'
          }
        }
      };
      utils.populateElementStore(config).then(store => {
        expect(store.feature instanceof Array).toBe(true);
        expect(store.feature.length).toBe(2);
        expect(store.feature[0]).toEqual({id: 'alpha'});
        done();
      });
    });
    it('resolves even when an error occurs while reading saved elements', done => {
      const proc = require('../../src/proc');
      const stderrSpy = spyOn(proc.stderr, 'write');
      const config = {
        schema: {
          error: {
            id: 'String'
          }
        }
      };
      utils.populateElementStore(config).then(store => {
        expect(stderrSpy).toHaveBeenCalled();
        expect(store).toBeDefined();
        done();
      });
    });
  });

  describe('serializePropType', () => {
    it('serializes a string', () => {
      const serial = utils.serializePropType('String', 'Marty');
      expect(serial).toBe('Marty');
    });
    it('serializes a number', () => {
      const serial = utils.serializePropType('Number', 13);
      expect(serial).toBe(13);
    });
    it('serializes a date', () => {
      const serial = utils.serializePropType('Date', new Date(0));
      expect(serial).toMatch(/1970-01-01/);
    });
    it('serializes an array of strings', () => {
      const serial = utils.serializePropType('[String]', ['Ron', 'Harry', 'Hermione']);
      expect(serial).toEqual(['Ron', 'Harry', 'Hermione']);
    });
    it('serializes an array of numbers', () => {
      const serial = utils.serializePropType('[Number]', [1, 2, 3]);
      expect(serial).toEqual([1, 2, 3]);
    });
    it('serializes an array of dates', () => {
      const serial = utils.serializePropType('[Date]', [new Date(0), new Date(24 * 60 * 60 * 1000)]);
      expect(serial[0]).toMatch(/1970-01-01/);
      expect(serial[1]).toMatch(/1970-01-02/);
    });
  });

  afterAll(() => {
    mock.stop('fs');
    mock.stop('path');
    mock.stop('../../src/proc');
  });
});
