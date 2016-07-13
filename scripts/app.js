define(function(require) {

	var ChatApp = require('./chat');
	var EventBus = require('./eventBus');
	var UsersContainer = require('./usersContainer');

	var chat = ChatApp(
			"chat-container",
			EventBus(function(callback) {return function(eventData) {callback(eventData)}}),
			UsersContainer(JSON.parse(localStorage.getItem("users")))
		).init();

});		