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
	require("./dto/roomDto");
	require('./service/userService');
	require('./service/chatService')
	require('./chat');
	require('./lib/eventBus');

	var chat = new ChatApp("chat-container").init();

});		