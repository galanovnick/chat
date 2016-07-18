var Storage = function() {
	var storage = {};

	var _addItem = function(key, value) {
		if (typeof storage[key] === 'undefined') {
			storage[key] = [];
		}
		storage[key].push(value);
	}

	var _getItems = function(key) {
		if (typeof storage[key] === 'undefined') {
			storage[key] = [];
		}
		//console.log(key + " |" + storage[key]);
		return storage[key];
	}

	return {
		"addItem": _addItem,
		"getItems": _getItems
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return Storage;
});