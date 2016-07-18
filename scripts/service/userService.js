var UserService = function(_userEventBus, _userStorage) {

	var events = {
		userAddedEvent : "USER_ADDED_EVENT",
		userListUpdatedEvent: "USER_LIST_UPDATED_EVENT",
		registrationFailedEvent : "REGISTRATION_FAILED_EVENT",
		successfullRegistrationEvent: "SUCCESSFUL_REGISTRATION_EVENT",
		authenticationFailedEvent: "AUTHENTICATION_FAILED_EVENT",
		successfullAuthenticationEvent: "SUCCESSFUL_AUTHENTICATION_EVENT"
	}

	var _create = function(user) {
		console.log("Trying to create user: " + user.username);

		if (user.username === "" || user.password === "" || user.password_r === "") {
			console.log("Failed creation of user '" + user.username + "'. Reason: empty input fields.");

			_userEventBus.post("Fields cannot be empty.", events.registrationFailedEvent);
		} else if(user.password !== user.password_r) {
			console.log("Failed creation of user '" + user.username + "'. Reason: passwords do not match.");

			_userEventBus.post("Passwords do not match.", events.registrationFailedEvent);
		} else if (_userStorage.hasUser(user.username)) {
			console.log("Failed creation of user '" + user.username + "'. Reason: user already exists.");

			_userEventBus.post("User already exists.", events.registrationFailedEvent);
		} else {
			console.log("User(" + user.username + ") created.")

			_userStorage.add({username: user.username, password: user.password}); //or DTO???

			_userEventBus.post(_userStorage.getAll(), events.userListUpdatedEvent);
			_userEventBus.post("", events.successfullRegistrationEvent);
		}
	}

	var _authenticate = function(user) {
		if (user.username === "" || user.password === "") {

			_userEventBus.post("Fields cannot be empty.", events.authenticationFailedEvent);
		} else {
			var allUsers = _userStorage.getAll();
			Object.keys(allUsers).forEach(function(elem) {
				if (elem === user.username && allUsers[elem] === user.password) {
					
					_userStorage.addAuthenticated(user);
					_userEventBus.post("", events.successfullAuthenticationEvent);

					return;
				}
			});
		}
	}

	var _onUserAdded = function(user) {
		_create(user);
	}
	
	var _onUserAuthenticated = function(user) {
		_authenticate(user);
	}

	return {
		"onUserAdded": _onUserAdded,
		"onUserAuthenticated": _onUserAuthenticated,
		"getAll": _userStorage.getAll,
		"getAllAuthenticated": _userStorage.getAllAuthenticated
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return UserService;
});