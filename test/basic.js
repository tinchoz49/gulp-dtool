var test = require('tape');

test('timing test', function (t) {
    t.plan(1);

    t.equal(typeof Date.now, 'test');
    var start = Date.now();
});