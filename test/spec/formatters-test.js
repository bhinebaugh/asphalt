const {Readable} = require('stream');
const formatters = require('../../src/formatters');

describe('Formatters', () => {
  const elements = [{
    name: 'Rey',
    alignment: 'Light'
  }, {
    name: 'Kylo',
    alignment: 'Dark'
  }];

  describe('itemDetails', () => {
    it('lists all properties for an element', () => {
      const formatter = formatters.itemDetailFormatter();
      formatter.write(elements[0]);
      expect(String(formatter.read())).toBe('name: Rey\nalignment: Light\n');
    });
    it('lists only specified keys for an element', () => {
      const formatter = formatters.itemDetailFormatter(['alignment']);
      formatter.write(elements[0]);
      expect(String(formatter.read())).toBe('alignment: Light\n');
    });
  });

  describe('itemSummary', () => {
    it('lists items in tab-delimited rows', () => {
      const formatter = formatters.itemSummaryFormatter();
      formatter.write(elements[1]);
      expect(String(formatter.read())).toBe('Kylo\tDark\n');
    });
    it('lists only specified keys for each element', () => {
      const formatter = formatters.itemSummaryFormatter(['name']);
      formatter.write(elements[1]);
      expect(String(formatter.read())).toBe('Kylo\n');
    });
  });
});
