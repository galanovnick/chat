requirejs.config({
	baseUrl: 'scripts',
	paths: {
		jquery: 'lib/jquery.min'
	}
});

define(function(require) {

	var ChatApp = require('./chat');
	var EventBus = require('./lib/eventBus');
	var UsersContainer = require('./userContainer');

	var eb = EventBus();

	var chat = ChatApp(
			"chat-container",
			eb,
			UsersContainer("users", eb)
		).init();

});		