var ChatApp = function(_rootId) {

	_userEventBus = EventBus();
	_userService = UserService(_userEventBus, UserStorage());

	var events = {
		userAddedEvent : "USER_ADDED_EVENT",
		userListUpdatedEvent: "USER_LIST_UPDATED_EVENT",
		registrationFailedEvent : "REGISTRATION_FAILED_EVENT",
		successfullRegistrationEvent: "SUCCESSFUL_REGISTRATION_EVENT"
	}

	var _userContext = {username: "Vasya"};

	var _components = {};

	var _init = function() {

		_components.registration = RegistrationComponent("reg-" + _rootId);
		//_components.userList = UserListComponent("u_list_" + _rootId);

		_userEventBus.subscribe(events.userAddedEvent, _userService.onUserAdded);
		//_userEventBus.subscribe(events.userListUpdatedEvent, _components.userList.onUserListUpdated);
		_userEventBus.subscribe(events.successfullRegistrationEvent, _components.registration.onRegistrationSuccess);
		_userEventBus.subscribe(events.registrationFailedEvent, _components.registration.onRegistrationFailed);

		Object.keys(_components).forEach(function(key) {

			_components[key].init();
		});

		if (typeof _userContext !== 'undefined') {
			_components.registration.hide();

			_components.main = MainWindowComponent("main-" + _rootId);
			_components.chatRooms = [];
			_components.chatRooms.push("chat-room#1-" + _rootId, EventBus(), _userContext.username);

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

			$("#register").click(function() {
				var username = $("#username").val();
				var password = $("#password").val();
				var password_r = $("#password_r").val();

				_register(UserDto(username, password, password_r));				
			});
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

	var ChatRoomComponent = function(_chatRoomId, _chatRoomEventBus, _ownerName) {

		var members;

		var _init = function() {
			console.log("Trying to initialie chat room with id = '" + _chatRoomId + "' and owner = '" + _ownerName + "'...");

			members = [_ownerName];
		}

		var _close = function() {
			console.log("Trying to close chat room with id = '" + _chatRoomId + "'...");

			$("#" + _chatRoomId).remove();
			members = null;
		}

		var _invite = function(username) {
			console.log("Trying to invite user with name = '" + username + "' to chat room with id = '" + _chatRoomId + "'...")

			if (username in members) {
				console.log("Failed user(username = '" + username + "') invitation, reason: user already in chat.");

			} else {
				console.log("User with name = '" + username + "' has been successfully invited in chat with id = '" + _chatRoomId + "'.");

				members.push(username);
			}
		}

		var _leave = function(username) {
			if (!(username in members)) {
				console.log("User with name = '" + username + "' cannot leave chat room(id = '" + _chatRoomId + "', reason: user not in this chat.");

			} else {
				members.forEach(function(elem, index) {
					if (elem === username) {

						members.splice(index, 1);

						return;
					}
				});
			}
		}

		var AddMessageComponent = function() {

			var _init = function() {

			}

			var _onMessageSuccessfullyAdded = function() {

			}

			var _onMessageAdditionFailed = function() {

			}
			
			return {
				"init": _init,
				"onMessageSuccessfullyAdded": _onMessageSuccessfullyAdded,
				"onMessageAdditionFailed": _onMessageAdditionFailed
			}
		}

		var MessageListComponent = function(_componentRootId, _messageService) {

			var _init = function() {

			}

			var _onMessageListUpdated = function(messages) {

			}

			return {
				"init": _init,
				"onMessageListUpdated": _onMessageListUpdated
			}
		}

		return {
			"init": _init,
			"invite": _invite,
			"leave": _leave,
			"close": _close
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