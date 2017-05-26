const fs = require('fs'), // this engine requires the fs module
  /* jshint ignore:start */
  interpolate = (content, localsKeys, localsValues) => new Function(
    ...localsKeys,
    'return `' + content + '`;'
  )(...localsValues),
  setPath = (views, ref, ext) => ref.endsWith(ext) ? ref : views  + '/' + ref + ext,
  /* jshint ignore:end */
  readPartial = path => {
    const findFile = (resolve, reject) => {
      const getContent = (err, content) => err ? reject(new Error(err)) : resolve(content);
      fs.readFile(path, 'utf-8', getContent);
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
        localsValues = localsKeys.map(i => locals[i]),
        partialsKeys = Object.keys(partials);
      if(partialsKeys.length) {
        const applySettings = partialKey => {
          const ext = '.' + settings['view engine']; 
          if(typeof settings.views === 'string') {
            return i => readPartial(setPath(settings.views, partials[i], ext));
          }
          const views = settings.views.slice();
          const requestFiles = i => {
            const searchFile = (resolve, reject) => {
              const getContent = (err, content) => {
                if (err) {
                  return views.length ? repeatSearch() : reject(new Error(err));
                }
                resolve(content);
              };
              const repeatSearch = () => fs.readFile(setPath(views.shift(), partials[i], ext), 'utf-8', getContent);
              repeatSearch();
            }
            return new Promise(searchFile);
          };
          return requestFiles;
        };
        const setPartial = settings ? applySettings() : i => readPartial(partials[i]);
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
