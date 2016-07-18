var MessageService = function(_eventBus, _storage, _roomId) {

	var events = {
		messageAdditionFailedEvent: "MESSAGE_ADDITION_FAILED_EVENT",
		messageSuccessfullyAddedEvent: "MESSAGE_SUCCESSFULLY_ADDED_EVENT"
	}

	var _onMessageAdded = function(message) {

		if (typeof message.text === 'undefined' || message.text === null || message.text === "") {

			_eventBus.post("Message text cannot be empty.", events.messageAdditionFailedEvent);
		} else {
			_storage.addItem("messages" + _roomId, message);

			_eventBus.post(_storage.getItems("messages" + _roomId), events.messageSuccessfullyAddedEvent);
		}
	}

	var _getAll = function() {
		return _storage.getItems("messages" + _roomId);
	}

	return {
		"onMessageAdded": _onMessageAdded,
		"getAll": _getAll
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return MessageService;
});