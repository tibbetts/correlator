var vows = require('vows'),
    assert = require('assert'),
    corr = require('../lib/correlator');

vows.describe('Simple Event Matching').addBatch({
    'Hello': {
        topic: new corr.Correlator(),

        'notice': function (correlator) {
        	var happened = false;
        	correlator.register("TheEvent", function(match, correlator) {
        		happened = true;
        	});
            correlator.assert(new corr.Event("TheEvent"));
            assert.equal(happened, true);
        },
        'negative match': {
        	topic: function(correlator) {
	        	var happened = false;
	        	var pattern = new corr.Pattern("TheEvent").not().timeout(1);
	        	var vowCallback = this.callback;
	        	correlator.register(pattern, function(match, correlator) {
	        		vowCallback(undefined, {match:match, correlator:correlator});
	        	});
	        },
        	"get the not match": function (err, topic) {
        		assert.isNull(err);
        		assert.isNull(topic.match);
        	}
        }
	}
}).export(module); // Export the Suite
