if (typeof localStorage === 'undefined') {
	localStorage = {getItem: function(){return "{}";}, setItem: function(){}};
}

var UsersService = function(_usersKey, _userEventBus) {
	var storage;

	if (typeof localStorage.getItem(_usersKey) === 'undefined' || localStorage.getItem(_usersKey) === null) {
		storage = {};
	} else {
		storage = JSON.parse(localStorage.getItem(_usersKey));
	}

	//storage = {};

	var _create = function(user) {
		console.log("Trying to create user: " + user.username);

		if (user.username === "" || user.password === "" || user.password_r === "") {
			console.log("Failed creation of user " + user + ". Reason: empty input fields.");

			_userEventBus.post("Fields cannot be empty.", "REGISTRATION_FAILED_EVENT");
		} else if(user.password !== user.password_r) {
			console.log("Failed creation of user " + user + ". Reason: passwords do not match.");

			_userEventBus.post("Passwords do not match.", "REGISTRATION_FAILED_EVENT");
		} else if (typeof storage[user.username] !== 'undefined') {
			console.log("Failed creation of user " + user + ". Reason: user already exists.");

			_userEventBus.post("User already exists.", "REGISTRATION_FAILED_EVENT");
		} else {
			console.log("User(" + user.username + ") created.")
			storage[user.username] = user.password;
			_userEventBus.post(_getAll(), "USER_LIST_UPDATED_EVENT");
			
			localStorage.setItem(_usersKey, JSON.stringify(storage));
		}
	}

	var _getAll = function() {
		console.log("Trying to provide users list(" + Object.keys(storage) + ")...");
		return storage;
	}

	return {
		"create": _create,
		"getAll": _getAll
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return UsersService;
});