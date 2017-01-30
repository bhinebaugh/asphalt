const errors = {
  '.other.error': () => ({
    err: {code: 'OTHERERROR'}
  }),
  '.actual.error': () => {
    throw new Error('Totally Legit Error');
  }
};

const directoriesToMake = Object.assign({}, errors, {
  '.asphalt': () => ({
    err: undefined
  }),
  '.asphalt.duplicate': () => ({
    err: 'EEXIST'
  })
});

const filesToRead = Object.assign({}, errors, {
  '.asphalt.json': () => ({
    data: '{"foo": "bar"}'
  }),
  '.not.a.file': () => ({
    err: {code: 'ENOENT'}
  }),
  '.not.valid.json': () => ({
    data: 'foo = bar(baz);'
  })
});

function mkdir(path, callback) {
  const {err} = directoriesToMake[path]();
  callback(err);
}

function readFile(path, callback) {
  const {err, data} = filesToRead[path]();
  callback(err, data);
}

module.exports = {
  mkdir,
  readFile
};
