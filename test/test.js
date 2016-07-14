var UserContainer = require('../scripts/userContainer');

var fakeEventBusImpl = {
	"post": function(){},
	"subscribe": function(){}
};

var userContainer = UserContainer("users", fakeEventBusImpl);

var firstUser = {username: "vasya", password: "qwerty", password_r: "qwerty"};
var secondUser = {username: "petya", password: "123456", password_r: "123456"};
var duplicatedFirstUser = {username: "vasya", password: "555", password_r: "555"};
var userWithDifferentPasswords = {username: "masha", password: "123", password_r: "132"};
var userWithEmptyFields = {username: "", password: "", password_r: ""};

userContainer.create(firstUser);
userContainer.create(secondUser);

userContainer.create(duplicatedFirstUser);

userContainer.create(userWithDifferentPasswords);

userContainer.create(userWithEmptyFields);

var allusers = userContainer.getAll();

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