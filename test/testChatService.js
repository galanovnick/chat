var EventBus = require('../scripts/lib/eventBus');
var ChatService = require('../scripts/service/chatService');
var Storage = require('../scripts/storage/storage');

describe("Chat service test-suite", function() {
	var test = require("unit.js");

	it("Should create chat room", function() {

		var chatService = new ChatService(EventBus(), Storage());

		chatService.onChatAdded("chat-room");

		var allRooms = chatService.getAllRooms();

		test
			.array(allRooms)
				.hasLength(1)
				.hasProperty(0, "chat-room")
		;
	});

	it("Should not create chat room with empty title", function() {

		var chatService = new ChatService(EventBus(), Storage());

		chatService.onChatAdded("");

		var allRooms = chatService.getAllRooms();

		test
			.array(allRooms)
				.hasLength(0)
	});

	it("Should not create chat rooms with duplicated titles", function() {

		var chatService = new ChatService(EventBus(), Storage());

		chatService.onChatAdded("chat-room");
		chatService.onChatAdded("chat-room");

		var allRooms = chatService.getAllRooms();

		test
			.array(allRooms)
				.hasLength(1)
				.hasNotProperty(1, "chat-room")
		;
	});
});