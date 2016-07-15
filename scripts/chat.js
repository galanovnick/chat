var ChatApp = function(_rootId, _userEventBus, _userService) {

	var events = {
		userAddedEvent : "USER_ADDED_EVENT",
		userListUpdatedEvent: "USER_LIST_UPDATED_EVENT",
		registrationFailedEvent : "REGISTRATION_FAILED_EVENT"
	}

	var _userContext/* = {username: "Vasya"}*/;

	var _components = {};

	var _init = function() {

		_components.registration = RegistrationComponent("reg-" + _rootId);
		_components.userList = UserListComponent("u_list_" + _rootId);

		_userEventBus.subscribe(events.userAddedEvent, _userService.onUserAdded);
		_userEventBus.subscribe(events.userListUpdatedEvent, _components.userList.onUserListUpdated);
		_userEventBus.subscribe(events.registrationSuccessEvent, _components.registration.onRegistrationSuccess);
		_userEventBus.subscribe(events.registrationFailedEvent, _components.registration.onRegistrationFailed);

		Object.keys(_components).forEach(function(key) {

			_components[key].init();
		});

		if (typeof _userContext !== 'undefined') {
			_components.registration.hide();

			_components.main = MainWindowComponent("main-" + _rootId);

			_components.main.init();
		}
	}

	var _createChatRoom = function(_chatRoom) {
		if (typeof _components.rooms === 'undefined') {
			_components.rooms = [];
		}

		_components.rooms.push(_chatRoom);
	}

	var RegistrationComponent = function(_componentRootId) {

		var _init = function() {
			$('<div><div style="padding:10px;">Registration</div>' +
				'<div style=padding:10px><input type="text" id="username" placeholder="Username"/></div>' +
				'<div style=padding:10px><input type="password" id="password" placeholder="Password"/></div>' +
				'<div style=padding:10px><input type="password" id="password_r" placeholder="Repeate password"/></div>' +
				'<div style=padding:10px><input type="button" id="register" value="Register"/></div></div>')
				.appendTo("#" + _rootId)
					.css({margin: 'auto', width: '200px', height: '205px', padding: '20px', border: '2px solid black', 'border-radius': '10px'})
					.attr('id', _componentRootId);

			document.getElementById("register").onclick = function() {
				var username = $("#username").val();
				var password = $("#password").val();
				var password_r = $("#password_r").val();

				_register(UserDto(username, password, password_r));				
			}
		}

		var _register = function(user) {
			console.log("Trying to post 'userAddedEvent' (user = " + user.username + ")...")
			_userEventBus.post(user, events.userAddedEvent);

		}

		var _registrationFailed = function(message) {
			if (!$("#reg_error").length) {
				$('<font id = "reg_error" color="red" style=padding:10px;>' + message + '</font>')
					.appendTo("#" + _componentRootId)
					.attr('id', 'reg_error');
			} else {
				$("#reg_error").html(message);
			}
		}

		var _resetFields = function() {
			if ($("#reg_error").length) {
				$("#reg_error").html("");
			}

			$("#username").val("");
			$("#password").val("");
			$("#password_r").val("");
		}

		var _hide = function() {
			$("#" + _componentRootId).remove();
		}

		var _onRegistrationFailed = function(message) {
			_registrationFailed(message);
		}

		var _onRegistrationSuccess = function() {
			_resetFields();
		}

		return {
			"init": _init,
			"hide": _hide,
			"register": _register,
			"onRegistrationSuccess": _onRegistrationSuccess,
			"onRegistrationFailed": _onRegistrationFailed
		}
	}

	var UserListComponent = function(_componentRootId) {

		var _init = function() {
			console.log(_rootId);
			$('<div style=padding:10px>Registered users:<div id="users"></div></div>')
				.appendTo("#" + _rootId)
					.css({width: '200px', height: '200px', padding: '20px', 'margin-left': 'auto', 'margin-right': 'auto', 
						'margin-top': '20px', 'border': '2px solid black', 'border-radius': '10px'})
					.attr('id', _componentRootId);

			_render(_userService.getAll());
		}

		var _render = function(users) {
			$("#users").html("");

			Object.keys(users).forEach(function(username) {
				$('<div> Username: ' + username + '</div>')
					.appendTo("#users")
						.css("padding", "10px");
			});
		}

		var _onUserListUpdated = function(users) {
			_render(users);
		}

		return {
			"init": _init,
			"onUserListUpdated": _onUserListUpdated
		}
	}

	var MainWindowComponent = function(_componentRootId) {

		var _init = function() {
			$('<div><input type="button" id="new-room" value="New chat" style="width: 110px; height: 25px; margin: 8px;"/>' +
				'<input type="button" id="join-room" value="Join chat" style="width: 110px; height: 25px; margin: 8px;"/></div>')
				.appendTo("#" + _rootId)
					.css({width: '128px', height: '83px', 'margin-right': 'auto', 'margin-top': '20px', border: '2px solid black', 'border-radius': '10px'})
					.attr("id", _componentRootId);
		}

		return {
			"init": _init
		}
	}

	return {"init" : _init};
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return ChatApp;
});