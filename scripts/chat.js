//TODO: bold, italic, href
//TODO: ctrl+enter default button action
var ChatApp = function(_rootId) {

	$.Mustache.addFromDom('registration-template');
	$.Mustache.addFromDom('login-template');

	var _storage = new Storage();
	var _eventBus = new EventBus();
	var _userService = new UserService(_eventBus, _storage);

	var _chatService;

	var _components = {};

	var _init = function() {

		_components.registrationComponent = new RegistrationComponent("reg-" + _rootId, _rootId, _eventBus);
		_components.loginComponent = new UserLoginComponent("login-" + _rootId, _rootId, _eventBus);

		_eventBus.subscribe(events.userAddedEvent, _userService.onUserAdded);
		_eventBus.subscribe(events.userAuthenticatedEvent, _userService.onUserAuthenticated);
		_eventBus.subscribe(events.successfulRegistrationEvent, _components.registrationComponent.onRegistrationSuccess);
		_eventBus.subscribe(events.registrationFailedEvent, _components.registrationComponent.onRegistrationFailed);
		_eventBus.subscribe(events.authenticationFailedEvent, _components.loginComponent.onUserAuthenticationFailed);
		_eventBus.subscribe(events.successfulAuthenticationEvent, _components.loginComponent.onUserSuccessfullyAuthenticated);
		_eventBus.subscribe(events.successfulAuthenticationEvent, _components.registrationComponent.onUserSuccessfullyAuthenticated);
		_eventBus.subscribe(events.successfulAuthenticationEvent, _createUserMenu);

		Object.keys(_components).forEach(function(key) {
			_components[key].init();
		});

		$('body').on('keyup', '.txt-input', function(event) {
			//event.preventDefault(); ? remove ?
			if (event.ctrlKey && event.keyCode === 13) {
				$(this).parent().children('.txt-input-btn').click();
			}
		});
	}

	var _createUserMenu = function() {
		_components.userBox = new UserMenuComponent("userBox", _rootId, _eventBus, _storage);
		_components.userBox.init();
	}

	return {"init" : _init};
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return ChatApp;
});