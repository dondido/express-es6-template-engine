const variablePattern = /\$\{[\s]*?([\w\d]+)[\s]*?[\}\?]/g;

const defineAllVariables = function(template, locals) {
  const localsDef = locals;

  let matchArray;
  while((matchArray = variablePattern.exec(template)) !== null) {
    if (typeof locals[matchArray[1]] === 'undefined') {
      localsDef[matchArray[1]] = null;
    }
  }

  return localsDef;
};

module.exports = {
  variablePattern,
  defineAllVariables
};
