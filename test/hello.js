var vows = require('vows'),
    assert = require('assert'),
    corr = require('../lib/correlator');

vows.describe('Simple Event Matching').addBatch({
    'Hello': {
        topic: new corr.Correlator(),

        'notice': function (correlator) {
        	happened = false;
        	correlator.match("TheEvent", function(match, correlator) {
        		happened = true;
        	})
            correlator.assert(new corr.Event("TheEvent"));
            assert.equal(happened, true);
        },
	}
}).export(module); // Export the Suite
