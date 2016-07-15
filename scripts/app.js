requirejs.config({
	baseUrl: 'scripts',
	paths: {
		jquery: 'lib/jquery.min'
	}
});

define(function(require) {

	require("./userDto");
	require("./userStorage");
	require('./chat');
	require('./lib/eventBus');
	require('./userService');

	var chat = ChatApp("chat-container").init();

});		