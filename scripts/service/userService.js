if (typeof define !== 'function') {
	events = require('../events');
}

var UserService = function(_userEventBus, _storage) {

	var _create = function(user) {
		console.log("Trying to create user: " + user.username);

		if (user.username === "" || user.password === "" || user.password_r === "") {
			console.log("Failed creation of user '" + user.username + "'. Reason: empty input fields.");

			_userEventBus.post("Fields cannot be empty.", events.registrationFailedEvent);
		} else if(user.password !== user.password_r) {
			console.log("Failed creation of user '" + user.username + "'. Reason: passwords do not match.");

			_userEventBus.post("Passwords do not match.", events.registrationFailedEvent);
		} else if (userExists(user)){
			_userEventBus.post("User already exists.", events.registrationFailedEvent);
		} else {
			console.log("User(" + user.username + ") created.")

			_storage.addItem("users", {username: user.username, password: user.password});

			_userEventBus.post("", events.successfulRegistrationEvent);
		}
	}

	var _authenticate = function(user) {
		if (user.username === "" || user.password === "") {
			_userEventBus.post("Fields cannot be empty.", events.authenticationFailedEvent);
		} else {
			if (userExists(user)) {

				_userEventBus.post(user.username, events.successfulAuthenticationEvent);

				return;
			}

			_userEventBus.post("User does not exist.", events.authenticationFailedEvent);	
		}
	}

	var _onUserAdded = function(user) {
		_create(user);
	}
	
	var _onUserAuthenticated = function(user) {
		return _authenticate(user);
	}

	var userExists = function(user) {
		var users = _storage.getItems("users");
		var userExistsKey = false;
		users.forEach(function(item) {
			if (item.username === user.username) {
				userExistsKey = true;
				return;
			}
		});
		return userExistsKey;
	}

	var _getAll = function() {
		return _storage.getItems("users");
	}

	return {
		"onUserAdded": _onUserAdded,
		"onUserAuthenticated": _onUserAuthenticated,
		"getAll": _getAll
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return UserService;
});