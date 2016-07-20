var UserLoginComponent = function(_componentRootId, _rootId, _eventBus) {

	var _init = function() {

		$('#' + _rootId + " .login-reg").mustache('login-template', {id: _componentRootId})

		$("#" + _componentRootId + " .login").click(function() {
			var username = $("#" + _componentRootId + " .username").val();
			var password = $("#" + _componentRootId + " .password").val();

			_login(new UserDto(username, password, ""));				
		});
	}

	var _login = function(user) {
		_eventBus.post(user, events.userAuthenticatedEvent);
	}

	var _onUserSuccessfullyAuthenticated = function(username) {
		$("#" + _componentRootId).remove();
		$('<input>')
			.attr('type', 'hidden')
			.attr('id', 'u-name')
			.val(username)
			.appendTo(("#" + _rootId));
	}

	var _onUserAuthenticationFailed = function(message) {
		$("#" + _componentRootId + " .error").html(message);
	}

	return {
		"onUserSuccessfullyAuthenticated": _onUserSuccessfullyAuthenticated,
		"onUserAuthenticationFailed": _onUserAuthenticationFailed,
		"init": _init
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return UserLoginComponent;
});