var chatApp = require('../chat-app');

var eventBus = require('../eventBus');

var usersContainer = require('../usersContainer');

var eb = eventBus.EventBus(function(callback) {return function(eventData) {callback(eventData)}});

var usersStorage = usersContainer.UsersContainer([]);

var chat = chatApp.ChatApp("chat-container", eb, usersStorage);

var firstUser = {username: "vasya", password: "qwerty"};
var secondUser = {username: "petya", password: "123456"};

eb.post(firstUser, 0);
eb.post(secondUser, 0);

var allusers = usersStorage.getAll();

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