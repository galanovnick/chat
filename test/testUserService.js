var EventBus = require('../scripts/lib/eventBus');
var UserService = require('../scripts/service/userService');
var UserDto = require('../scripts/dto/userDto');
var Storage = require('../scripts/storage/storage')

describe("User service test-suite", function() {

	var test = require("unit.js");

	it("Should create users", function() {

		var userService = UserService(EventBus(), Storage());
		var firstUser = UserDto("vasya", "qwerty", "qwerty");

		userService.onUserAdded(firstUser);

		var allusers = userService.getAll();

		test
			.array(allusers)
				.hasLength(1)
			.object(allusers[0])
				.is({username: firstUser.username, password: firstUser.password});
		;
	});

	it("Should not create users with duplicate names", function() {
		var userService = UserService(EventBus(), Storage());
		var firstUser = UserDto("vasya", "qwerty", "qwerty");

		var duplicatedFirstUser = UserDto("vasya", "555", "555");

		userService.onUserAdded(firstUser);
		userService.onUserAdded(duplicatedFirstUser);

		var allusers = userService.getAll();

		test
			.array(allusers)
				.hasLength(1)
		;
	});

	it("Should not create users with different passwords", function() {
		var userService = UserService(EventBus(), Storage());
		var userWithDifferentPasswords = UserDto("masha", "123", "132");

		userService.onUserAdded(userWithDifferentPasswords);

		var allusers = userService.getAll();

		test
			.array(allusers)
				.hasLength(0)
		;
	});

	it("Should not create users with empty name", function() {
		var userService = UserService(EventBus(), Storage());
		var userWithEmptyFields = UserDto("", "123", "123");

		userService.onUserAdded(userWithEmptyFields);

		var allusers = userService.getAll();

		test
			.array(allusers)
				.hasLength(0)
		;
	});

	it("Should not create users with empty password", function() {
		var userService = UserService(EventBus(), Storage());
		var userWithEmptyFields = UserDto("vasya", "", "123");

		userService.onUserAdded(userWithEmptyFields);

		var allusers = userService.getAll();

		test
			.array(allusers)
				.hasLength(0)
		;
	});

	it("Should not create users with empty password_r", function() {
		var userService = UserService(EventBus(), Storage());
		var userWithEmptyFields = UserDto("vasya", "123", "");

		userService.onUserAdded(userWithEmptyFields);

		var allusers = userService.getAll();

		test
			.array(allusers)
				.hasLength(0)
		;
	});
});