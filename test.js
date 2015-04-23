var namespaced = require('./');
var assert = require('assert');

describe('namespaced', function() {
  function ns(expected /* rest */) {
    var result = namespaced('my', Array.prototype.slice.call(arguments, 1));
    assert.deepEqual(expected, result)
  };
  it('should handle simple rules', function() {
    ns('foo',               'foo');
    ns('my-foo',            ':foo');
    ns('my-foo zot',        ':foo', 'zot');
    ns('my-foo zot',        ':foo', 'zot');
    ns('my-foo bar my-zot', ':foo bar :zot');
    ns('',                  false && ':foo bar :zot');
    ns('my-foo bar my-zot', false || ':foo bar :zot');
    ns('',                  true || ':foo bar :zot');
    ns('my-foo bar my-zot', true && ':foo bar :zot');
    ns('',                  undefined && ':foo bar :zot');
    ns('my-foo bar my-zot', undefined || ':foo bar :zot');
    ns('',                  null && ':foo bar :zot');
    ns('my-foo bar my-zot', null || ':foo bar :zot');
  });

  it('should handle array rules', function() {
    ns('my-foo zot my-bar',     [':foo', 'zot', ':bar']);
    ns('my-foo zot my-bar qux', [':foo', 'zot', [':bar', 'qux']]);
  });

  it('should handle function rules', function() {
    var a = namespaced('my', function(i) { return ':c' + i; });
    assert.equal('my-c1', a(1));

    var b = namespaced('my', function(i) { return [':c' + i, 'zot', ':qux']; });
    assert.equal('my-c1 zot my-qux', b(1));
  });

  it('should handle object rules', function() {
    ns({foo: 'foo', bar: 'my-bar'},
       {foo: 'foo', bar: ':bar'});

    ns({foo: 'foo', nested: { bar: 'my-bar', zot: 'my-zot'}},
       {foo: 'foo', nested: { bar: ':bar', zot: ':zot' }});

    ns({foo: 'foo', array: 'my-bar my-zot'},
       {foo: 'foo', array: [':bar', ':zot']});

    var a = namespaced('my', {
      foo: 'foo',
      bar: ':bar',
      fun: function(i) { return ':c' + i; },
      arr: [':qux', 'quux'],
      nes: {
        biff: 'biff',
        buff: ':buff'
      }
    });

    assert.equal('foo',         a.foo);
    assert.equal('my-bar',      a.bar);
    assert.equal('my-c1',       a.fun(1));
    assert.equal('my-qux quux', a.arr);
    assert.equal('biff',        a.nes.biff);
    assert.equal('my-buff',     a.nes.buff);
  });
});

