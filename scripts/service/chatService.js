if (typeof define !== 'function') {
	events = require('../events');
}

var ChatService = function(_eventBus, _storage) {

	var _registerRoom = function(chatRoomTitle) {
		if (chatRoomTitle === '') {
			_eventBus.post("Chat name cannot be empty.", events.roomCreationFailedEvent);
		} else if(chatExists(chatRoomTitle)) {
			_eventBus.post("Chat with such name already exists.", events.roomCreationFailedEvent);
		} else {

			_storage.addItem("chats", chatRoomTitle);
			_eventBus.post(chatRoomTitle, events.roomSuccessfullyCreatedEvent);
		}
	}

	var _onUserJoined = function(userRequestData) {
		var chatRoomTitle = userRequestData.title;
		if (chatRoomTitle === '') {
			_eventBus.post("Chat name cannot be empty.", events.failedRoomJoinEvent);
		} else if(!chatExists(chatRoomTitle)) {
			_eventBus.post("Chat with such name does not exist.", events.failedRoomJoinEvent);
		} else if(isUserJoined(userRequestData.username, chatRoomTitle)) {
			_eventBus.post("You cannot join chat room '" + chatRoomTitle + "' twice.", events.failedRoomJoinEvent);
		} else {

			_storage.addItem(chatRoomTitle, userRequestData.username)
			_eventBus.post(chatRoomTitle, events.userSuccessfullyJoinedEvent);
		}
	}

	var chatExists = function(chatRoomTitle) {
		var chats = _storage.getItems("chats");
		return chats.indexOf(chatRoomTitle) > -1;
	}

	var isUserJoined = function(username, chatRoomTitle) {
		var usersInChat = _storage.getItems(chatRoomTitle);

		return usersInChat.indexOf(username) > -1;
	}

	var _getAllRooms = function() {
		return _storage.getItems("chats");
	}

	return {
		"onChatAdded": _registerRoom,
		"getAllRooms": _getAllRooms,
		"onUserJoined": _onUserJoined
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return ChatService;
});