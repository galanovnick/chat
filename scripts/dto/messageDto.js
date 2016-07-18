var MessageDto = function(username, text, roomId) {
	return {
		"username": username,
		"text": text,
		"roomId": roomId
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return MessageDto;
});