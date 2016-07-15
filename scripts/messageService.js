var MessageService = function(_eventBus, _messageStorage) {

	var events = {
		messageAdditionFailedEvent: "MESSAGE_ADDITION_FAILED_EVENT",
		messageSuccessfullyAddedEvent: "MESSAGE_SUCCESSFULLY_ADDED_EVENT"
	}

	var _onMessageAdded = function(message) {

		if (message.text == "") {

			_eventBus.post("Message text cannot be empty.", events.messageAdditionFailedEvent);
		} else {
			_messageStorage.put(message.username, message.text);

			_eventBus.post(_messageStorage.getAll(), events.messageSuccessfullyAddedEvent);
		}
	}

	return {
		"onMessageAdded": _onMessageAdded,
		"getAll": _messageStorage.getAll()
	}
}