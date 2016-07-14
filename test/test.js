var UserContainer = require('../scripts/userContainer');

var fakeEventBusImpl = {
	"post": function(){},
	"subscribe": function(){}
};

var userContainer = UserContainer("users", fakeEventBusImpl);

var firstUser = {username: "vasya", password: "qwerty", password_r: "qwerty"};
var secondUser = {username: "petya", password: "123456", password_r: "123456"};

userContainer.create(firstUser);
userContainer.create(secondUser);

var allusers = userContainer.getAll();

describe("test-suite", function() {

	var test = require("unit.js");

	it("Failed on return of users list.", function() {
		test
			.object(allusers)
			.hasLength(2)
		;
	});

	it("Failed user addition.", function() {
		test
			.object(allusers)
				.hasProperty(firstUser.username, firstUser.password)
				.hasProperty(secondUser.username, secondUser.password)
		;
	});

});