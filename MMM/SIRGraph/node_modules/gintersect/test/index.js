var intersect = require('../');
var test = require('tap').test;

test('it finds intersection', function(t) {
  var intersection = intersect(
    // first segment
    -1, 1, // start
    1, -1, // end
    // second segment
    -1, -1, // start
    1, 1 // end
  );
  t.equals(intersection.x, 0, 'X is found');
  t.equals(intersection.y, 0, 'Y is found');

  var parallel = intersect(
    // first segment
    0, 1, // start
    0, 2, // end
    // second segment
    1, 1, // start
    1, 2 // end
  );
  t.notOk(parallel, 'There should be no intersection for parallel segments');
  t.end();
});
