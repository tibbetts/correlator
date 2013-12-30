//
// Correlator.js - asynchronous event-processing for Node.js
//
var _ = require("underscore"),
	PriorityQueue = require("priorityqueuejs"),
	moment = require("moment"),
	corr = exports;

corr.Correlator = function () {
	this.listeners = {};
	this.timeouts = new PriorityQueue(function (a,b) {
		return a.timeofdeath - b.timeofdeath
	});
};

corr.Correlator.prototype.register = function(pattern, callback) {
	if (_.isString(pattern)) {
		pattern = new corr.Pattern(pattern);
	}
	var reg = _.extend(pattern, {
		callback : callback,
	});
	if (pattern._timeout) {
		var timeofdeath = moment().add("ms", pattern._timeout);
		reg.timeofdeath = timeofdeath;
		this.timeouts.enq(reg);
		this._checkTimeouts();
	}
	this.listeners[pattern.type] = reg;
	return reg;
};

corr.Correlator.prototype._checkTimeouts = function() {
	var that = this;
	console.log("_checkTimeouts this=", this);
	var now = moment();
	var nextTimeout;
	while (!this.timeouts.isEmpty()) {
		nextTimeout = this.timeouts.peek().timeofdeath;
		if (!nextTimeout.isAfter(now)) {
			var next = this.timeouts.deq();
			this._doTimeout(next);
		} else {
			var interval = nextTimeout - now;
			console.log("setTimeout interval=", interval);
			setTimeout(function () {that._checkTimeouts();}, interval);
			return;
		}
	}
};

corr.Correlator.prototype._doTimeout = function(pattern) {
	if (pattern._negate) {
		pattern.callback(null, this);
	}
};

corr.Correlator.prototype.assert = function(event) {
	var pattern = this.listeners[event.type];
	if (pattern) {
		pattern.callback(event, this);
	}
};

corr.Event = function (type) {
	this.type = type;
};

corr.Pattern = function (text) {
	this.type = text;
};

corr.Pattern.prototype.not = function () {
	this._negate = true;
	return this;
};

corr.Pattern.prototype.timeout = function (timeout) {
	// TODO: time spec.
	this._timeout = timeout;
	return this;
};
