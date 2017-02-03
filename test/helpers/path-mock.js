function resolve(...args) {
  return Array.prototype.join.call(args, '/')
    .replace(/\/{2,}/)
    .replace(/^\//, '')
    .replace(/\/$/, '');
}

module.exports = {
  resolve
};
