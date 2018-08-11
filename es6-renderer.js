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
    
module.exports = (path, options, render) => {
  if(options === undefined || typeof options === 'string') {
    return compile(path, options);
  }
  let willResolve;
  let willReject;
  const fulfillPromise = (resolve, reject) => { 
    willResolve = resolve;
    willReject = reject;
  };
  const {locals = {}, partials = {}, settings, template} = options; 
  const assign = (err, content) => {
    const send = () => {
      if(render) {
        try {
          const compiled = compile(content, localsKeys)(...localsValues);
          const output = render(null, compiled);
          return willResolve ? willResolve(compiled) : output;
        } catch (err) {
          return willReject ? willReject(err) : render(err);
        }
      }
      try {
        return willResolve(compile(content, localsKeys)(...localsValues));
      } catch (err) {
        return willReject(err);
      }
    }
    if(err) {
      return render ? render(err) : willReject(err);
    }
    const localsKeys = Object.keys(locals);
    const localsValues = localsKeys.map(i => locals[i]);
    const partialsKeys = Object.keys(partials);
    const compilePartials = values => {
      const valTempList = localsValues.concat(values);
      localsValues.push(...values.map(i => compile(i, localsKeys)(...valTempList)));
      send();
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
      const willGetPartials = Promise.all(partialsKeys.map(setPartial)).then(compilePartials, willReject);
      return willResolve ? willGetPartials : new Promise(fulfillPromise);
    }
    return send();
  };
  if(template) {
    render = render || ((err, content) => err || content);
    return assign(null, path);
  }
  fs.readFile(path, 'utf-8', assign);
  return new Promise(fulfillPromise);
};