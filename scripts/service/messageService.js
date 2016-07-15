var MessageService = function(_eventBus, _messageStorage) {

	var events = {
		messageAdditionFailedEvent: "MESSAGE_ADDITION_FAILED_EVENT",
		messageSuccessfullyAddedEvent: "MESSAGE_SUCCESSFULLY_ADDED_EVENT"
	}

	var _onMessageAdded = function(message) {

		if (typeof message.text === 'undefined' || message.text === null || message.text === "") {

			_eventBus.post("Message text cannot be empty.", events.messageAdditionFailedEvent);
		} else {
			_messageStorage.put(message);

			_eventBus.post(_messageStorage.getAll(), events.messageSuccessfullyAddedEvent);
		}
	}

	return {
		"onMessageAdded": _onMessageAdded,
		"getAll": _messageStorage.getAll
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return MessageService;
});