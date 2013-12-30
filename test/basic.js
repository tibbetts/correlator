var corr = require('../lib/correlator');

exports.testBasic = function (test) {
	var correlator = new corr.Correlator();
	var happened = false;
	correlator.register("TheEvent", function(match, correlator) {
		happened = true;
	});
    correlator.assert(new corr.Event("TheEvent"));
    test.equal(happened, true);
    test.done();
};
exports.testZeroTimeout = function (test) {
	setTimeout(function() {test.done()}, 0);
};
exports.testTimeout = function (test) {
	setTimeout(function() {test.done()}, 10);
};
exports.testNegative = function (test) {
	var correlator = new corr.Correlator();
	var happened = false;
	var pattern = new corr.Pattern("TheEvent").not().timeout(100);
	correlator.register(pattern, function(match, correlator) {
		test.done();
	});
};
