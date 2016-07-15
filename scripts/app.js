requirejs.config({
	baseUrl: 'scripts',
	paths: {
		jquery: 'lib/jquery.min'
	}
});

define(function(require) {

	require("./userDto");
	require("./storage/userStorage");
	require('./chat');
	require('./lib/eventBus');
	require('./service/userService');

	var chat = ChatApp("chat-container").init();

});		