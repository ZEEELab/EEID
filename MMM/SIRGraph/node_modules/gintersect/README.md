# gintersect

Finds intersection between two lines. This is JavaScript adaptation of Mukesh
Prasad's work from [Grapchis Gem II](http://www.opensource.apple.com/source/graphviz/graphviz-498/graphviz/dynagraph/common/xlines.c)
book. It is supposed to be very fast.

[![Build Status](https://travis-ci.org/anvaka/gintersect.svg)](https://travis-ci.org/anvaka/gintersect)
# usage

``` javascript
var intersect = require('gintersect');
var intersection = intersect(
  // first segment
  -1, 1, // start
  1, -1, // end
  // second segment
  -1, -1, // start
  1, 1 // end
);
console.log(intersection);
// prints {x: 0, y: 0} - intersection point of two segments
```

If no intersection found return value is falsy:

``` javascript
var parallel = intersect(
  // first segment
  0, 1, // start
  0, 2, // end
  // second segment
  1, 1, // start
  1, 2 // end
);
console.log(parallel);
// prints null - two parallel segments do not intersect.
```

# install

With [npm](https://npmjs.org) do:

```
npm install gintersect
```

# license

MIT
