var UserStorage = function(_usersKey) {

	var _userContainer;
	var _authenticatedUsers;

	var _updateStorage;

	if (typeof _usersKey === 'undefined') {
		_userContainer = {};
		_authenticatedUsers = [];
		_updateStorage = function() {};
	} else {
		_userContainer = JSON.parse(localStorage.getItem(_usersKey));
		_authenticatedUsers = JSON.parse(localStorage.getItem(_usersKey + 'auth'));
		_updateStorage = function() {
			localStorage.setItem(_usersKey, JSON.stringify(_userContainer));
			localStorage.setItem(_usersKey + 'auth', JSON.stringify(_authenticatedUsers));
		}
	}

	var _add = function(user) {
		_userContainer[user.username] = user.password;
		_updateStorage();
	}

	var _addAuthenticated = function(username) {
		_authenticatedUsers.push(username);
		_updateStorage();
	}

	var _getAll = function() {
		return _userContainer;
	}

	var _hasUser = function(username) {
		var userExistsKey = false;
		Object.keys(_userContainer).forEach(function(elem) {
			if (elem === username) {
				userExistsKey = true;
				return;
			}
		});
		return userExistsKey;
	}

	var _isAuthenticated = function(username) {
		return _authenticatedUsers.indexOf(username) > -1;
	}

	return {
		"add": _add,
		"addAuthenticated": _addAuthenticated,
		"hasUser": _hasUser,
		"isAuthenticated": _isAuthenticated,
		"getAll": _getAll
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return UserStorage;
});