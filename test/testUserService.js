var EventBus = require('../scripts/lib/eventBus');
var UserStorage = require('../scripts/storage/userStorage');
var UserService = require('../scripts/service/userService');
var UserDto = require('../scripts/dto/userDto');

describe("User service test-suite", function() {

	var test = require("unit.js");

	it("Should create users", function() {

		var userService = UserService(EventBus(), UserStorage());
		var firstUser = UserDto("vasya", "qwerty", "qwerty");

		userService.onUserAdded(firstUser);

		var allusers = userService.getAll();

		test
			.object(allusers)
			.hasLength(1)
			.hasProperty(firstUser.username, firstUser.password);
		;
	});

	it("Should not create users with duplicate names", function() {
		var userService = UserService(EventBus(), UserStorage());
		var firstUser = UserDto("vasya", "qwerty", "qwerty");

		var duplicatedFirstUser = UserDto("vasya", "555", "555");

		userService.onUserAdded(firstUser);
		userService.onUserAdded(duplicatedFirstUser);

		var allusers = userService.getAll();

		test
			.object(allusers)
				.hasLength(1)
				.hasNotProperty(duplicatedFirstUser.username, duplicatedFirstUser.password);
		;
	});

	it("Should not create users with different passwords", function() {
		var userService = UserService(EventBus(), UserStorage());
		var userWithDifferentPasswords = UserDto("masha", "123", "132");

		userService.onUserAdded(userWithDifferentPasswords);

		var allusers = userService.getAll();

		test
			.object(allusers)
				.hasLength(0)
				.hasNotProperty(userWithDifferentPasswords.username, userWithDifferentPasswords.password)
		;
	});

	it("Should not create users with empty name", function() {
		var userService = UserService(EventBus(), UserStorage());
		var userWithEmptyFields = UserDto("", "123", "123");

		userService.onUserAdded(userWithEmptyFields);

		var allusers = userService.getAll();

		test
			.object(allusers)
				.hasLength(0)
				.hasNotProperty(userWithEmptyFields.username, userWithEmptyFields.password)
		;
	});

	it("Should not create users with empty password", function() {
		var userService = UserService(EventBus(), UserStorage());
		var userWithEmptyFields = UserDto("vasya", "", "123");

		userService.onUserAdded(userWithEmptyFields);

		var allusers = userService.getAll();

		test
			.object(allusers)
				.hasLength(0)
				.hasNotProperty(userWithEmptyFields.username, userWithEmptyFields.password)
		;
	});

	it("Should not create users with empty password_r", function() {
		var userService = UserService(EventBus(), UserStorage());
		var userWithEmptyFields = UserDto("vasya", "123", "");

		userService.onUserAdded(userWithEmptyFields);

		var allusers = userService.getAll();

		test
			.object(allusers)
				.hasLength(0)
				.hasNotProperty(userWithEmptyFields.username, userWithEmptyFields.password)
		;
	});

	it("Should authenticate users", function() {
		var userService = UserService(EventBus(), UserStorage());
		var user = UserDto("vasya", "123", "123");

		userService.onUserAdded(user);
		userService.onUserAuthenticated({username: user.username, password: user.password});

		test
			.array(userService.getAllAuthenticated())
				.hasLength(1)
				.hasProperty(0, user.username)
		;
	});

	it("Should not authenticate users with empty username", function() {
		var userService = UserService(EventBus(), UserStorage());
		var user = UserDto("vasya", "123", "123");

		userService.onUserAdded(user);
		userService.onUserAuthenticated({username: "", password: user.password});
		
		test
			.array(userService.getAllAuthenticated())
				.hasLength(0)
				.hasNotProperty(0, user.username)
		;
	});

	it("Should not authenticate users with empty password", function() {
		var userService = UserService(EventBus(), UserStorage());
		var user = UserDto("vasya", "123", "123");

		userService.onUserAdded(user);
		userService.onUserAuthenticated({username: user.username, password: ""});
		
		test
			.array(userService.getAllAuthenticated())
				.hasLength(0)
				.hasNotProperty(0, user.username)
		;
	});
});