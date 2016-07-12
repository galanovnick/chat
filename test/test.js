var usersContainer = require('../chat-app.js');
console.log(usersContainer);
var container = usersContainer.UsersContainer();

var firstUser = {username: "vasya", password: "qwerty"};
var secondUser = {username: "petya", password: "123456"};

container.add(firstUser);
container.add(secondUser);

var allusers = container.getAll();

describe("test-suite", function() {

	var test = require("unit.js");

	it("Failed on return of users list.", function() {
		test
			.array(allusers)
			.hasLength(2)
		;
	});

	it("Failed user addition.", function() {
		test
			.array(allusers)
				.hasProperty(firstUser.username, firstUser.password)
				.hasProperty(secondUser.username, secondUser.password)
		;
	});

});