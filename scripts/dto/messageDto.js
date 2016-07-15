var MessageDto = function(username, text) {
	return {
		"username": username,
		"text": text
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return MessageDto;
});