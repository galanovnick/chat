requirejs.config({
	baseUrl: 'scripts',
	paths: {
		jquery: 'lib/jquery.min'
	}
});

define(function(require) {

	require("./events");
	require("./storage/storage")
	require("./dto/userDto");
	require("./dto/messageDto");
	require('./service/userService');
	require('./service/chatService')
	require('./service/messageService');
	require('./chat');
	require('./lib/eventBus');

	var chat = new ChatApp("chat-container").init();

});		