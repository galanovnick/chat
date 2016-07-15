var ChatApp = function(_rootId) {

	_userEventBus = EventBus();
	_userService = UserService(_userEventBus, UserStorage());

	var events = {
		userAddedEvent : "USER_ADDED_EVENT",
		registrationFailedEvent : "REGISTRATION_FAILED_EVENT",
		successfullRegistrationEvent: "SUCCESSFUL_REGISTRATION_EVENT"
	}

	var _userContext = {username: "User"};

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

			_components.main = MenuComponent("main-" + _rootId);

			_createChatRoom(ChatRoomComponent("chat-room№1", EventBus(), _userContext.username, "Some Chat"));

			_components.main.init();
			_components.chatRooms[0].init();
		}
	}

	var _createChatRoom = function(_chatRoom) {
		if (typeof _components.chatRooms === 'undefined') {
			_components.chatRooms = [];
		}

		_components.chatRooms.push(_chatRoom);
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
			console.log("Trying to post 'userAddedEvent' (user = " + user.username + ")...");
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
			$('<div>Registered users:</div>')
				.appendTo("#" + _rootId)
					.css({width: '200px', height: '200px', padding: '20px', 'margin-left': 'auto', 'margin-right': 'auto', 
						'margin-top': '20px', 'border': '2px solid black', 'border-radius': '10px'})
					.attr('id', _componentRootId)
						.append('<div></div>')
							.attr('id', 'users');

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

	var MenuComponent = function(_componentRootId) {

		var _init = function() {
			$('<div></div>')
				.appendTo("#" + _rootId)
					.css({width: '258px', height: '83px', 'margin-right': 'auto', 'margin-top': '20px', 
						border: '2px solid black', 'border-radius': '10px'})
					.attr("id", _componentRootId)
						.append($('<input/>')
							.attr('type', 'button')
							.attr('id', 'new-room')
							.val('New chat')
							.css({width: '110px', height: '25px', margin: '8px', display: 'inline'}))
						.append($('<input/>')
							.attr('type', 'text')
							.attr('id', 'room-name')
							.attr('placeholder', 'Chat name')
							.css({width: '80px', height: '15px', margin: '8px'}))
						.append($('<input/>')
							.attr('type', 'button')
							.attr('id', 'join-room')
							.val('Join chat')
							.css({width: '110px', height: '25px', margin: '8px'}));

			$("#" + _componentRootId + ".new-room")
		}

		return {
			"init": _init
		}
	}

	var ChatRoomComponent = function(_componentRootId, _chatRoomEventBus, _ownerName, _chatName) {

		var chatRoomEvents = {
			messageAddedEvent: "MESSAGE_ADDED_EVENT",
			messageSuccessfullyAddedEvent: "MESSAGE_SUCCESSFULLY_ADDED_EVENT",
			messageAdditionFailedEvent: "MESSAGE_ADDITION_FAILED_EVENT",
			messagesListUpdatedEvent: "MESSAGES_LIST_UPDATED_EVENT"
		}

		var members;

		var _messageService = MessageService(_chatRoomEventBus, MessageStorage());

		_chatRoomComponents = {};

		var _chatRoomDomContent;

		var _init = function() {
			console.log("Trying to initialie chat room with id = '" + _componentRootId + "' and owner = '" + _ownerName + "'...");

			$('<div>' + _chatName + '<hr></div>')
				.appendTo("#" + _rootId)
					.css({width: '250px', height: '390px', padding: '10px', margin: 'auto', border: '2px solid black', 'border-radius': '10px'})
					.attr('id', _componentRootId)
						.append('<div class="chat-room-content"></div>');

			$("<input/>")
				.appendTo("#" + _componentRootId)
					.attr('type', 'button')
					.val('Invite')
					.css({width: '60px', height: '30px', 'margin-top': '5px'});

			$("<input/>")
				.appendTo("#" + _componentRootId)
					.attr('type', 'text')
					.attr('placeholder', 'User nickname')
					.css({width: '100px', height: '20px', 'margin': '5px'});

			_chatRoomDomContent = $("#" + _componentRootId + " .chat-room-content");

			members = [_ownerName];

			_chatRoomComponents.messageList = MessageListComponent();
			_chatRoomComponents.addMessage = AddMessageComponent();

			_chatRoomEventBus.subscribe(chatRoomEvents.messageAddedEvent, _messageService.onMessageAdded);
			_chatRoomEventBus.subscribe(chatRoomEvents.messageSuccessfullyAddedEvent, _chatRoomComponents.addMessage.onMessageSuccessfullyAdded);
			_chatRoomEventBus.subscribe(chatRoomEvents.messageAdditionFailedEvent, _chatRoomComponents.addMessage.onMessageAdditionFailed);
			_chatRoomEventBus.subscribe(chatRoomEvents.messageSuccessfullyAddedEvent, _chatRoomComponents.messageList.onMessageListUpdated);

			Object.keys(_chatRoomComponents).forEach(function(key) {
				_chatRoomComponents[key].init();
			});
		}

		var AddMessageComponent = function() {

			var _init = function() {
				$('<textarea></textarea>')
					.appendTo(_chatRoomDomContent)
						.css({'margin-top': '5px', width: '245px', height: '40px'})
						.attr('placeholder', 'Type message here')
						.addClass('message-input-box');
				$('<input/>')
					.appendTo(_chatRoomDomContent)
						.css({width: '80px', height: '40px', display: 'inline'})
						.attr('type', 'button')
						.attr('value', 'Send')
						.addClass('send-message-btn');
				$('<div></div>')
					.appendTo(_chatRoomDomContent)
						.css({display: 'inline', margin: '3px', color: 'red', 'font-size': '10pt'})
						.addClass('error');

				$(_chatRoomDomContent).children(".send-message-btn").click(function() {
					var message = MessageDto(_userContext.username, $(_chatRoomDomContent).children(".message-input-box").val());

					_chatRoomEventBus.post(message ,chatRoomEvents.messageAddedEvent);
				});
			}

			var _onMessageSuccessfullyAdded = function() {
				$(_chatRoomDomContent).children(".error").html("");
				$(_chatRoomDomContent).children(".message-input-box").val("");
			}

			var _onMessageAdditionFailed = function(message) {
				$(_chatRoomDomContent).children(".error").html(message);
			}
			
			return {
				"init": _init,
				"onMessageSuccessfullyAdded": _onMessageSuccessfullyAdded,
				"onMessageAdditionFailed": _onMessageAdditionFailed
			}
		}

		var MessageListComponent = function() {

			var _init = function() {
				$('<div></div>')
					.appendTo(_chatRoomDomContent)
						.css({'word-wrap': 'break-word', 'overflow-x': 'hidden', 'overflow-y': 'auto', 'padding-left': '10px',
							'padding-right': '10px', width: '230px', height: '225px', border: '1px solid black', 'border-radius': '10px'})
						.addClass('messages');
			}

			var _onMessageListUpdated = function(messages) {
				var messageBox = $(_chatRoomDomContent).children(".messages");
				messageBox.html("");
				messages.forEach(function(message) {
					$('<p>' + message.username + ': ' + message.text + '</p>')
						.appendTo(messageBox);
				});

				var scrollValue = messages.length * 37;
				messageBox.scrollTop(scrollValue);
			}

			return {
				"init": _init,
				"onMessageListUpdated": _onMessageListUpdated
			}
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