var _ = require('lodash');

module.exports = function(namespace) {
  function parseSimpleRule(rule) {
    if (_.isString(rule)) {
      // local-name or global-name, actually supports also rules like
      // ':foo :bar', i.e.  two classes in one string
      return rule.replace(/(^| ):/g, "$1" + namespace + "-");
    } else if (_.isBoolean(rule) || _.isNull(rule) || _.isUndefined(rule)) {
      // something we consider as empty
      return [];
    } else {
      // error
      console.error(rule, "is not a proper 'namespaced' rule");
      return ["namespaced-error"];
    }
  }

  function parseObjectRule(o) {
    return _.mapValues(o, parseRule);
  }

  function parseFunctionRule(f) {
    return _.flow(f, parseRule);
  }

  function parseRules(rules) {
    var arr = _.chain(rules).map(parseRule).flatten().value();
    switch(arr.length) {
    case 0: return '';
    case 1: return arr[0]; // can return object also
    default: return arr.join(' ');
    }
  }

  function parseRule(rule) {
    if (_.isArray(rule)) {
      return parseRules(rule); // array
    } else if (_.isFunction(rule)) {
      return parseFunctionRule(rule); // function
    } else if (_.isObject(rule)) {
      return parseObjectRule(rule); // object
    } else {
      return parseSimpleRule(rule); // simple-rule
    }
  }

  if (arguments.length == 1) {
    return function(/* arguments */) { return parseRules(arguments); };
  } else if (arguments.length > 1) {
    return parseRules(Array.prototype.slice.call(arguments, 1));
  } else {
    console.error("No namespace defined for 'namespaced'");
    return "namespaced-error";
  }
};
