var UserStorage = function(_usersKey) {

	var _userContainer;

	var _updateStorage;

	if (typeof _usersKey === 'undefined') {
		_userContainer = {};
		_updateStorage = function() {};
	} else {
		_userContainer = JSON.parse(localStorage.getItem(_usersKey));
		_updateStorage = function() {
			localStorage.setItem(_usersKey, JSON.stringify(_userContainer));
		}
	}

	var _add = function(user) {
		_userContainer[user.username] = user.password;
		_updateStorage();
	}

	var _getAll = function() {
		return _userContainer;
	}

	var _hasUser = function(username) {
		var userExistsKey = false;
		Object.keys(_userContainer).forEach(function(elem) {
			if (elem == username) {
				userExistsKey = true;
				return;
			}
		});
		return userExistsKey;
	}

	return {
		"add": _add,
		"hasUser": _hasUser,
		"getAll": _getAll
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return UserStorage;
});