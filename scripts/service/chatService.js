if (typeof define !== 'function') {
	events = require('../events');
}

var ChatService = function(_eventBus, _storage) {

	var _registerRoom = function(chatRoomTitle) {
		if (chatRoomTitle === '') {
			_eventBus.post("Chat name cannot be empty.", events.roomCreationFailedEvent);
		} else if(isChatExists(chatRoomTitle)) {
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
		} else if(!isChatExists(chatRoomTitle)) {
			_eventBus.post("Chat with such name does not exist.", events.failedRoomJoinEvent);
		} else if(isUserJoined(userRequestData.username, chatRoomTitle)) {
			_eventBus.post("You cannot join chat room '" + chatRoomTitle + "' twice.", events.failedRoomJoinEvent);
		} else {

			_storage.addItem(chatRoomTitle, userRequestData.username)
			_eventBus.post(chatRoomTitle, events.userSuccessfullyJoinedEvent);
		}
	}

	var isChatExists = function(chatRoomTitle) {
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

	var _randomId = function() {
		var result = "";
    	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 10; i++ ) {
	        result += possible.charAt(Math.floor(Math.random() * possible.length));
	    }

		return result;
	}

	var randomIdPrefix = _randomId();

	var _onMessageAdded = function(message) {

		if (typeof message.text === 'undefined' || message.text === null || message.text === "") {

			_eventBus.post({roomId: message.roomId, text: "Message text cannot be empty."}, events.messageAdditionFailedEvent);
		} else {
			_storage.addItem(randomIdPrefix + message.roomId, message);

			_eventBus.post({roomId: message.roomId, messages: _storage.getItems(randomIdPrefix + message.roomId)}, events.messageSuccessfullyAddedEvent);
		}
	}

	var _getAllMessages = function(roomId) {
		return _storage.getItems(randomIdPrefix + roomId);
	}

	return {
		"onChatAdded": _registerRoom,
		"getAllRooms": _getAllRooms,
		"onUserJoined": _onUserJoined,
		"onMessageAdded": _onMessageAdded,
		"getAllMessages": _getAllMessages
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return ChatService;
});