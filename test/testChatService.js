var EventBus = require('../scripts/lib/eventBus');
var ChatService = require('../scripts/service/chatService');
var Storage = require('../scripts/storage/storage');
var MessageDto = require('../scripts/dto/messageDto');

describe("Chat service test-suite", function() {
	var test = require("unit.js");

	it("Should create chat room", function() {

		var chatService = new ChatService(new EventBus(), new Storage());

		chatService.onChatAdded("chat-room");

		var allRooms = chatService.getAllRooms();

		test
			.array(allRooms)
				.hasLength(1)
				.hasProperty(0, "chat-room")
		;
	});

	it("Should not create chat room with empty title", function() {

		var chatService = new ChatService(new EventBus(), new Storage());

		chatService.onChatAdded("");

		var allRooms = chatService.getAllRooms();

		test
			.array(allRooms)
				.hasLength(0)
	});

	it("Should not create chat rooms with duplicated titles", function() {

		var chatService = new ChatService(new EventBus(), new Storage());

		chatService.onChatAdded("chat-room");
		chatService.onChatAdded("chat-room");

		var allRooms = chatService.getAllRooms();

		test
			.array(allRooms)
				.hasLength(1)
				.hasNotProperty(1, "chat-room")
		;
	});

	it("Should add messages", function() {

		var chatService = new ChatService(new EventBus(), new Storage());
		chatService.onChatAdded("room-id");
		chatService.onUserJoined({username: "Vasya", title: "room-id"});

		var message = new MessageDto("Vasya", "Hello world!", "room-id");

		chatService.onMessageAdded(message);

		var allmessages = chatService.getAllMessages("room-id");

		test
			.array(allmessages)
				.hasLength(1)
				.hasProperty(0, message)
		;
	});

	it("Should not add message from user that is not in chat", function() {

		var chatService = new ChatService(new EventBus(), new Storage());
		chatService.onChatAdded("room-id");

		var message = new MessageDto("Vasya", "Hello world!", "room-id");

		chatService.onMessageAdded(message);

		var allmessages = chatService.getAllMessages("room-id");

		test
			.array(allmessages)
				.hasLength(0)
				.hasNotProperty(0, message)
		;
	});

	it("Should not add empty messages", function() {

		var chatService = new ChatService(new EventBus(), new Storage());
		chatService.onChatAdded("room-id");
		chatService.onUserJoined({username: "Vasya", title: "room-id"});

		var emptyMessage1 = new MessageDto("Vasya", "", "room-id");
		var emptyMessage2 = new MessageDto("Vasya");
		var emptyMessage3 = new MessageDto("Vasya", null, "room-id");

		chatService.onMessageAdded(emptyMessage1);
		chatService.onMessageAdded(emptyMessage2);
		chatService.onMessageAdded(emptyMessage3);

		var allmessages = chatService.getAllMessages("room-id");

		test
			.array(allmessages)
				.hasLength(0)
				.hasNotProperty(0, emptyMessage1)
				.hasNotProperty(1, emptyMessage2)
				.hasNotProperty(2, emptyMessage3)
		;
	});
});