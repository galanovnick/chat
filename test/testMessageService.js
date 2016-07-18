var EventBus = require('../scripts/lib/eventBus');
var MessageService = require('../scripts/service/messageService');
var Storage = require('../scripts/storage/storage');
var MessageDto = require('../scripts/dto/messageDto');

describe("Message service test-suite", function() {
	var test = require("unit.js");

	it("Should add messages", function() {

		var messageService = MessageService(EventBus(), Storage());

		var message = MessageDto("Vasya", "Hello world!", "room-id");

		messageService.onMessageAdded(message);

		var allmessages = messageService.getAll();

		test
			.array(allmessages)
				.hasLength(1)
				.hasProperty(0, message)
		;
	});

	it("Should not add empty messages", function() {

		var messageService = MessageService(EventBus(), Storage());

		var emptyMessage1 = MessageDto("Vasya", "", "room-id");
		var emptyMessage2 = MessageDto("Vasya");
		var emptyMessage3 = MessageDto("Vasya", null, "room-id");

		messageService.onMessageAdded(emptyMessage1);
		messageService.onMessageAdded(emptyMessage2);
		messageService.onMessageAdded(emptyMessage3);

		var allmessages = messageService.getAll();

		test
			.array(allmessages)
				.hasLength(0)
				.hasNotProperty(0, emptyMessage1)
				.hasNotProperty(1, emptyMessage2)
				.hasNotProperty(2, emptyMessage3)
		;
	});
});