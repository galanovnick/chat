var UserDto = function(username, password, password_r) {
	return {
		"username": username,
		"password": password,
		"password_r": password_r
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return UserDto;
});