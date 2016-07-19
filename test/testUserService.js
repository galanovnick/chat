var EventBus = require('../scripts/lib/eventBus');
var UserService = require('../scripts/service/userService');
var UserDto = require('../scripts/dto/userDto');
var Storage = require('../scripts/storage/storage');
var events = require('../scripts/events');

describe("User service test-suite", function() {

	var assertThat = require("unit.js");

	it("Should create users", function() {

		var delivered = [];
		var eb = new EventBus();

		eb.subscribe(events.successfulRegistrationEvent, function(username) {
			delivered.push(username);
		});

		var userService = new UserService(eb, new Storage());
		var firstUser = new UserDto("vasya", "qwerty", "qwerty");
		var secondUser = new UserDto("petya", "123", "123");

		userService.onUserAdded(firstUser);
		userService.onUserAdded(secondUser);

		var allusers = userService.getAll();

		assertThat
			.array(allusers)
				.hasLength(2)
			.object(allusers[0])
				.is({username: firstUser.username, password: firstUser.password})
			.object(allusers[1])
				.is({username: secondUser.username, password: secondUser.password});
		;

		assertThat
			.array(delivered)
				.hasLength(2)
				.hasProperty(0, firstUser.username)
				.hasProperty(1, secondUser.username)
		;
	});

	it("Should not create users with duplicate names", function() {
		var delivered = false;
		var eb = new EventBus();

		eb.subscribe(events.registrationFailedEvent, function() {
			delivered = true;
		});

		var userService = new UserService(eb, new Storage());
		var firstUser = new UserDto("vasya", "qwerty", "qwerty");

		var duplicatedFirstUser = new UserDto("vasya", "555", "555");

		userService.onUserAdded(firstUser);
		userService.onUserAdded(duplicatedFirstUser);

		var allusers = userService.getAll();

		assertThat
			.array(allusers)
				.hasLength(1)
		;

		assertThat
			.value(delivered)
				.is(true)
		;
	});

	it("Should not create users with different passwords", function() {
		var delivered = false;
		var eb = new EventBus();

		eb.subscribe(events.registrationFailedEvent, function() {
			delivered = true;
		});

		var userService = new UserService(eb, new Storage());
		var userWithDifferentPasswords = new UserDto("masha", "123", "132");

		userService.onUserAdded(userWithDifferentPasswords);

		var allusers = userService.getAll();

		assertThat
			.array(allusers)
				.hasLength(0)
		;

		assertThat
			.value(delivered)
				.is(true)
		;
	});

	it("Should not create users with empty name", function() {
		var delivered = false;
		var eb = new EventBus();

		eb.subscribe(events.registrationFailedEvent, function() {
			delivered = true;
		});

		var userService = new UserService(eb, new Storage());
		var userWithEmptyFields = new UserDto("", "123", "123");

		userService.onUserAdded(userWithEmptyFields);

		var allusers = userService.getAll();

		assertThat
			.array(allusers)
				.hasLength(0)
		;
		assertThat
			.value(delivered)
				.is(true)
		;
	});

	it("Should not create users with empty password", function() {
		var delivered = false;
		var eb = new EventBus();

		eb.subscribe(events.registrationFailedEvent, function() {
			delivered = true;
		});
		var userService = new UserService(eb, new Storage());
		var userWithEmptyFields = new UserDto("vasya", "", "123");

		userService.onUserAdded(userWithEmptyFields);

		var allusers = userService.getAll();

		assertThat
			.array(allusers)
				.hasLength(0)
		;
		assertThat
			.value(delivered)
				.is(true)
		;
	});

	it("Should not create users with empty password confirmation", function() {
		var delivered = false;
		var eb = new EventBus();

		eb.subscribe(events.registrationFailedEvent, function() {
			delivered = true;
		});
		var userService = new UserService(eb, new Storage());
		var userWithEmptyFields = new UserDto("vasya", "123", "");

		userService.onUserAdded(userWithEmptyFields);

		var allusers = userService.getAll();

		assertThat
			.array(allusers)
				.hasLength(0)
		;
		assertThat
			.value(delivered)
				.is(true)
		;
	});
});