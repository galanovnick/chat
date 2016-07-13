define(function(require) {
	
	var ChatApp = require('./chat');
	var EventBus = require('./eventBus');
	var UsersContainer = require('./usersContainer');

	var eb = EventBus(function(callback) {return function(eventData) {callback(eventData)}});

	var chat = ChatApp(
			"chat-container",
			eb,
			UsersContainer("users", eb)
		).init();

});		