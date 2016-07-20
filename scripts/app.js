requirejs.config({
	baseUrl: 'scripts',
	paths: {
		jquery: 'lib/jquery.min'
	}
});

define(function(require) {

	require("./events");
	require('./lib/eventBus');
	require("./storage/storage")
	require("./dto/userDto");
	require("./dto/messageDto");
	require("./dto/roomDto");
	require('./service/userService');
	require('./service/chatService')
	require('./uiComponents/registration');
	require('./uiComponents/login');
	require('./uiComponents/menu');
	require('./uiComponents/chatRoom');
	require('./chat');
	
	var chat = new ChatApp("chat-container").init();

});		