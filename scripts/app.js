requirejs.config({
	baseUrl: 'scripts',
	paths: {
		jquery: 'lib/jquery.min'
	}
});

define(function(require) {

	require("./dto/userDto");
	require("./dto/messageDto");
	require("./storage/userStorage");
	require("./storage/messageStorage");
	require('./service/userService');
	require('./service/messageService');
	require('./chat');
	require('./lib/eventBus');

	var chat = ChatApp("chat-container").init();

});		