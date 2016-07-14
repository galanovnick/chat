require("../scripts/userStorage");

var UserStorage = require('../scripts/userStorage');
var UserService = require('../scripts/userService');
var UserDto = require('../scripts/userDto');

var fakeEventBusImpl = {
	"post": function(){},
	"subscribe": function(){}
};

var userService = UserService(fakeEventBusImpl, UserStorage());

var firstUser = UserDto("vasya", "qwerty", "qwerty");
var secondUser = UserDto("petya", "123456", "123456");
var duplicatedFirstUser = UserDto("vasya", "555", "555");
var userWithDifferentPasswords = UserDto("masha", "123", "132");
var userWithEmptyFields = UserDto("", "", "");

userService.create(firstUser);
userService.create(secondUser);

userService.create(duplicatedFirstUser);

userService.create(userWithDifferentPasswords);

userService.create(userWithEmptyFields);

var allusers = userService.getAll();

describe("test-suite", function() {

	var test = require("unit.js");

	it("Should provide list of all users.", function() {
		test
			.object(allusers)
			.hasLength(2)
		;
	});

	it("Should create users.", function() {
		test
			.object(allusers)
				.hasProperty(firstUser.username, firstUser.password)
				.hasProperty(secondUser.username, secondUser.password)
		;
	});

	it("Should not create users with duplicate names.", function() {
		test
			.object(allusers)
				.hasNotProperty(duplicatedFirstUser.username, duplicatedFirstUser.password)
		;
	});

	it("Should not create users with different passwords.", function() {
		test
			.object(allusers)
				.hasNotProperty(userWithDifferentPasswords.username, userWithDifferentPasswords.password)
		;
	});

	it("Should not create users with empty name or passwords.", function() {
		test
			.object(allusers)
				.hasNotProperty(userWithEmptyFields.username, userWithEmptyFields.password)
		;
	});
});