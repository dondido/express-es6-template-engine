const fs = require('fs'), // this engine requires the fs module
  /* jshint ignore:start */
  interpolate = (content, localsKeys, localsValues) => new Function(
    ...localsKeys,
    'return `' + content + '`;'
  )(...localsValues),
  /* jshint ignore:end */
  readPartial = path => {
    const findFile = (resolve, reject) => {
      const getFileContent = (err, content) => err ? reject(new Error(err)) : resolve(content);
      fs.readFile(path, 'utf-8', getFileContent);
    };
    return new Promise(findFile);
  };
    
module.exports = (path, options, callback) => {
  const {locals = {}, partials = {}, template, settings} = options,
    compile = (err, content) => {
      if(err) {
        return callback(new Error(err));
      }
      const localsKeys = Object.keys(locals),
        localsValues = Object.values(locals),
        partialsKeys = Object.keys(partials);
      if(partialsKeys.length) {
        const setPartial = settings ? (partialKey => {
          const ext = '.' + settings['view engine'],
            views = settings.views + '/';
            return i => readPartial(views + partials[i] + ext);
          })() : i => readPartial(partials[i]);
        localsKeys.push(...partialsKeys);
        return Promise.all(partialsKeys.map(setPartial))
          .then(values => {
            const valTempList = localsValues.concat(values);
            localsValues.push(...values.map(i => interpolate(i, localsKeys, valTempList)));
            return callback(null, interpolate(content, localsKeys, localsValues));
          })
          .catch(err => callback(err));
      }
      return callback(null, interpolate(content, localsKeys, localsValues));
    };
  if (template) {
    return compile(null, path);
  }
  fs.readFile(path, 'utf-8', compile);
};
