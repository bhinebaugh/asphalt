const payloads = {
  '.asphalt.json': () => ({
    data: '{"foo": "bar"}'
  }),
  '.not.a.file': () => ({
    err: {code: 'ENOENT'}
  }),
  '.not.valid.json': () => ({
    data: 'foo = bar(baz);'
  }),
  '.other.error': () => ({
    err: {code: 'SUCHERROR'}
  }),
  '.actual.error': () => {
    throw new Error('SUCHERROR');
  }
};

function readFile(path, callback) {
  const {err, data} = payloads[path]();
  callback(err, data);
}

module.exports = {
  readFile
};
