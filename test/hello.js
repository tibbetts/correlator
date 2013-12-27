var vows = require('vows'),
    assert = require('assert');

vows.describe('Hello World').addBatch({
    'Hello': {
        topic: "Hello World",

        'length': function (hello) {
            assert.equal (hello.length, 11);
        },
	}
}).export(module); // Export the Suite
