var EventBus = require('../scripts/lib/eventBus');
var ChatService = require('../scripts/service/chatService');
var Storage = require('../scripts/storage/storage');
var MessageDto = require('../scripts/dto/messageDto');
var RoomDto = require('../scripts/dto/roomDto');

describe("Chat service test suite", function() {
	var assertThat = require("unit.js");

	it("Should create chat room", function() {
		var delivered = [];
		var eb = EventBus();

		eb.subscribe(events.roomSuccessfullyCreatedEvent, function(roomTitle) {
			delivered.push(roomTitle);
		});

		var chatService = new ChatService(eb, new Storage());

		var firstRoom = new RoomDto("first chat room");
		var secondRoom = new RoomDto("second chat room");

		chatService.onRoomAdded(firstRoom);
		chatService.onRoomAdded(secondRoom);

		var allRooms = chatService.getAllRooms();

		assertThat
			.array(allRooms)
				.hasLength(2)
			.object(allRooms[0])
				.is({title: firstRoom.title})
			.object(allRooms[1])
				.is({title: secondRoom.title})
		;
		assertThat
			.array(delivered)
				.hasLength(2)
				.hasProperty(0, firstRoom.title)
				.hasProperty(1, secondRoom.title)
	});

	it("Should not create chat room with empty title", function() {

		var delivered = false;
		var eb = EventBus();

		eb.subscribe(events.roomCreationFailedEvent, function() {
			delivered = true;
		})

		var chatService = new ChatService(eb, new Storage());

		chatService.onRoomAdded(new RoomDto(""));

		var allRooms = chatService.getAllRooms();

		assertThat
			.array(allRooms)
				.hasLength(0)
		;
		assertThat
			.value(delivered)
				.is(true)
		;
	});

	it("Should not create chat rooms with duplicated titles", function() {

		var delivered = false;
		var eb = EventBus();

		eb.subscribe(events.roomCreationFailedEvent, function() {
			delivered = true;
		})

		var chatService = new ChatService(eb, new Storage());

		chatService.onRoomAdded(new RoomDto("chat room"));
		chatService.onRoomAdded(new RoomDto("chat room"));

		var allRooms = chatService.getAllRooms();

		assertThat
			.array(allRooms)
				.hasLength(1)
				.hasNotProperty(1, "chat room")
		;
		assertThat
			.value(delivered)
				.is(true)
		;		
	});

	it("Should add messages", function() {

		var delivered = [];
		var eb = EventBus();
		eb.subscribe(events.messageSuccessfullyAddedEvent, function(callbackData) {
			delivered.push(callbackData.roomId);
		});

		var chatService = new ChatService(eb, new Storage());
		chatService.onRoomAdded(new RoomDto("room id"));
		chatService.onUserJoined({username: "Vasya", title: "room id"});

		var message1 = new MessageDto("Vasya", "Hello world!", "room id");
		var message2 = new MessageDto("Vasya", "banana", "room id");

		chatService.onMessageAdded(message1);
		chatService.onMessageAdded(message2);

		var allmessages = chatService.getAllMessages("room id");

		assertThat
			.array(allmessages)
				.hasLength(2)
			.object(allmessages[0])
				.is(message1)
			.object(allmessages[1])
				.is(message2)
		;
		assertThat
			.array(delivered)
				.hasLength(2)
				.hasProperty(0, "room id")
				.hasProperty(1, "room id")
		;
	});

	it("Should not add message from user that is not in chat", function() {

		var delivered = false;
		var eb = EventBus();
		eb.subscribe(events.messageAdditionFailedEvent, function() {
			delivered = true;
		});

		var chatService = new ChatService(eb, new Storage());
		chatService.onRoomAdded(new RoomDto("room id"));

		var message = new MessageDto("Vasya", "Hello world!", "room id");

		chatService.onMessageAdded(message);

		var allmessages = chatService.getAllMessages("room id");

		assertThat
			.array(allmessages)
				.hasLength(0)
				.hasNotProperty(0, message)
		;

		assertThat
			.value(delivered)
				.is(true);
	});

	it("Should not add empty messages", function() {

		var delivered = false;
		var eb = EventBus();
		eb.subscribe(events.messageAdditionFailedEvent, function() {
			delivered = true;
		});

		var chatService = new ChatService(eb, new Storage());
		chatService.onRoomAdded(new RoomDto("room id"));
		chatService.onUserJoined({username: "Vasya", title: "room id"});

		var emptyMessage1 = new MessageDto("Vasya", "", "room id");
		var emptyMessage2 = new MessageDto("Vasya");
		var emptyMessage3 = new MessageDto("Vasya", null, "room id");

		chatService.onMessageAdded(emptyMessage1);
		chatService.onMessageAdded(emptyMessage2);
		chatService.onMessageAdded(emptyMessage3);

		var allmessages = chatService.getAllMessages("room id");

		assertThat
			.array(allmessages)
				.hasLength(0)
				.hasNotProperty(0, emptyMessage1)
				.hasNotProperty(1, emptyMessage2)
				.hasNotProperty(2, emptyMessage3)
		;
		assertThat
			.value(delivered)
				.is(true);
	});
});