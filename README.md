# namespaced

> Create namespaced css class names.

## Install

```
$ npm install namespaced
```

## Usage

Use a colon to denote a local class name. The colon is replaced by the
given namespace and a hyphen. The constructs are:

* local names, e.g. `:foo`, to which the namespace is prepended.
* global names, e.g. `bar`, which are not altered
* arrays of class names, e.g. `[:foo, bar]`
* functions, whose return value are namespaced
* objects, whose member values are recursively handled according to the rules

Only strings are accepted as class names. The following values are
silently discarded: `null`, `undefined`, `false`, `true`.

See examples below.

### One-liners

```js
namespaced('my', ':local')              // 'my-local'
namespaced('my', ':local', 'global')    // 'my-local global'
namespaced('my', [':local', 'global'])  // 'my-local global'
```

### Curried

```js
var css = namespaced('my')
css(':bar')                                 // 'my-bar'
css(':bar', 'zot')                          // 'my-bar zot'
css([':bar', 'zot'])                        // 'my-bar zot'
css(null && ':bar')                         // ''
css(false || ':bar')                        // 'my-bar'
css('foo', true && ':bar', false && ':zot') // 'foo my-bar'
```


### A `styles` object

```js
var styles = namespaced('my', {
  foo: ':foo',                                         // 'my-foo'
  bar: 'bar',                                          // 'bar'
  zot: [':zot', 'bar', false && ':foo'],               // 'my-zot bar'
  qux: 'bar :foo :zot',                                // 'bar my-foo my-zot'
  nested: {
    stuff: ['bar', ':stuff']                           // 'bar my-stuff'
  },
  fun: function(o) { return ':important-' + o.key; }
});

styles.foo               // 'my-foo'
styles.nested.stuff      // 'bar my-stuff'
styles.fun({key: 'foo'}) // 'my-important-foo'

```

## Details

More specifically, if there is just one argument, a function is
returned.  If more than one argument is given, the remaining arguments
are evaluated as rules.

Here's a BNF-ish specification of what is possible:

```
rules       := [rule*]
rule        := simple-rule | object | function | rules
simple-rule := local-name | global-name
local-name  := ':' classname
global-name := classname
```

Where `object` is an object whose member's values are `rule`s and
`function` is a function that returns a `rule`.

## License

http://en.wikipedia.org/wiki/ISC_license