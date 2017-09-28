const fs = require('fs'); // this engine requires the fs module
/* jshint ignore:start */
const compile = (content, $ = '$') => Function($, 'return `' + content + '`;');
/* jshint ignore:end */
const setPath = (views, ref, ext) => ref.endsWith(ext) ? ref : views  + '/' + ref + ext;
const getPartial = (path, cb = 'resolveNeutral') => {
  const findFile = function(resolve, reject) {
    this.resolveNeutral = (err, content) => err ? reject(new Error(err)) : resolve(content);
    this.resolvePositive = (err, content) => resolve(err || content);
    fs.readFile(path, 'utf-8', this[cb]);
  };
  return new Promise(findFile);
};
    
module.exports = (path, options, render = (err, content) => err || content) => {
  if(options === undefined || typeof options === 'string') {
    return compile(path, options);
  }
  const {locals = {}, partials = {}, settings, template} = options;
  
  const assign = (err, content) => {
    if(err) {
      return render(new Error(err));
    }
    const localsKeys = Object.keys(locals);
    const localsValues = localsKeys.map(i => locals[i]);
    const partialsKeys = Object.keys(partials);
    const compilePartials = values => {
      const valTempList = localsValues.concat(values);
      localsValues.push(...values.map(i => compile(i, localsKeys)(...valTempList)));
      return render(null, compile(content, localsKeys)(...localsValues));
    };
    if(partialsKeys.length) {
      const applySettings = () => {
        const ext = '.' + settings['view engine'];
        if(typeof settings.views === 'string') {
          return i => getPartial(setPath(settings.views, partials[i], ext));
        }
        return i => {
          const getFile = view => getPartial(setPath(view, partials[i], ext), 'resolvePositive');
          const getFirst = value => typeof value === 'string';
          const searchFile = (resolve, reject) => {
            const getContent = values => resolve(values.find(getFirst));
            Promise.all(settings.views.map(getFile)).then(getContent);
          };
          return new Promise(searchFile);
        };
      };
      const setPartial = settings ? applySettings() : i => getPartial(partials[i]);
      localsKeys.push(...partialsKeys);
      return Promise.all(partialsKeys.map(setPartial))
        .then(compilePartials)
        .catch(err => render(err));
    }
    return render(null, compile(content, localsKeys)(...localsValues));
  };
  if (template) {
    return assign(null, path);
  }
  fs.readFile(path, 'utf-8', assign);
};
