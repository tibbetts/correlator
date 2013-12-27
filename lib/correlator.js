//
// Correlator.js - asynchronous event-processing for Node.js
//
var corr = exports;

corr.Correlator = function () {
	this.listeners = {};
}

corr.Correlator.prototype.match = function(event, callback) {
	this.listeners[event] = callback;
}

corr.Correlator.prototype.assert = function(event) {
	callback = this.listeners[event.type];
	if (callback) {
		callback(event, this);
	}
}

corr.Event = function (type) {
	this.type = type;
}