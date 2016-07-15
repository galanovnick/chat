var MessageStorage = function() {
	var _messageContainer = [];

	var _put = function(message) {
		_messageContainer.push(message);
	}

	var _getAll = function() {
		return _messageContainer;
	}

	return {
		"put": _put,
		"getAll": _getAll
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return MessageStorage;
});