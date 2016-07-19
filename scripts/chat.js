//TODO: new EVERYWHERE!
//TODO: add dropwdown
//TODO: join message and chat services
//TODO: remove messageId from message service

var ChatApp = function(_rootId) {

	var _storage = new Storage();
	var _userEventBus = new EventBus();
	var _userService = new UserService(_userEventBus, _storage);

	var _components = {};

	var _init = function() {

		_components.registrationComponent = new RegistrationComponent("reg-" + _rootId);
		_components.loginComponent = new UserLoginComponent("login-" + _rootId);

		_userEventBus.subscribe(events.userAddedEvent, _userService.onUserAdded);
		_userEventBus.subscribe(events.userAuthenticatedEvent, _userService.onUserAuthenticated);
		_userEventBus.subscribe(events.successfullRegistrationEvent, _components.registrationComponent.onRegistrationSuccess);
		_userEventBus.subscribe(events.registrationFailedEvent, _components.registrationComponent.onRegistrationFailed);
		_userEventBus.subscribe(events.authenticationFailedEvent, _components.loginComponent.onUserAuthenticationFailed);
		_userEventBus.subscribe(events.successfullAuthenticationEvent, _components.loginComponent.onUserSuccessfullyAuthenticated);
		_userEventBus.subscribe(events.successfullAuthenticationEvent, _components.registrationComponent.onUserSuccessfullyAuthenticated);
		_userEventBus.subscribe(events.successfullAuthenticationEvent, _createUserBox);

		Object.keys(_components).forEach(function(key) {

			_components[key].init();
		});
	}

	var _createUserBox = function() {
		_components.userBox = new UserBoxComponent("userBox");
		_components.userBox.init();
	}

	var RegistrationComponent = function(_componentRootId) {

		var _init = function() {
			$('<div>')
				.html('Registration')
				.addClass('container')
				.appendTo('#' + _rootId + " .login-reg")
					.attr('id', _componentRootId)
						.append($('<input/>')
							.attr('type', 'text')
							.attr('placeholder', 'Username')
							.addClass('username'))
						.append($('<input/>')
							.attr('type', 'password')
							.attr('placeholder', 'Password')
							.addClass('password'))
						.append($('<input/>')
							.attr('type', 'password')
							.attr('placeholder', 'Repeate password')
							.addClass('password_r'))
						.append($('<input/>')
							.attr('type', 'button')
							.val('Register')
							.addClass('register'))
						.append($('<font>')
							.addClass('error')
							.attr('color', 'red'));

			$("#" + _componentRootId + " .register").click(function() {
				var username = $("#" + _componentRootId + " .username").val();
				var password = $("#" + _componentRootId + " .password").val();
				var password_r = $("#" + _componentRootId + " .password_r").val();

				_register(UserDto(username, password, password_r));				
			});
		}

		var _register = function(user) {
			console.log("Trying to post 'userAddedEvent' (user = " + user.username + ")...");
			_userEventBus.post(user, events.userAddedEvent);

		}

		var _registrationFailed = function(message) {
			$("#" + _componentRootId + " .error").html(message);
		}

		var _resetFields = function() {
			$("#" + _componentRootId + " .error").html("");

			$("#" + _componentRootId + " .username").val("");
			$("#" + _componentRootId + " .password").val("");
			$("#" + _componentRootId + " .password_r").val("");
		}

		var _onUserSuccessfullyAuthenticated = function() {
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
			"register": _register,
			"onRegistrationSuccess": _onRegistrationSuccess,
			"onRegistrationFailed": _onRegistrationFailed,
			"onUserSuccessfullyAuthenticated": _onUserSuccessfullyAuthenticated
		}
	}

	var UserLoginComponent = function(_componentRootId) {

		var _init = function() {
			$('<div>')
				.html('Login </br>')
				.addClass('container')
				.appendTo('#' + _rootId + " .login-reg")
					.attr('id', _componentRootId)
						.append($('<input/>')
							.attr('type', 'text')
							.attr('placeholder', 'Username')
							.addClass('username'))
						.append($('<input/>')
							.attr('type', 'password')
							.attr('placeholder', 'Password')
							.addClass('password'))
						.append($('</br><input/>')
							.attr('type', 'button')
							.val('Login')
							.addClass('login'))
						.append($('<font>')
							.addClass('error')
							.attr('color', 'red'));


			$("#" + _componentRootId + " .login").click(function() {
				var username = $("#" + _componentRootId + " .username").val();
				var password = $("#" + _componentRootId + " .password").val();

				_login(UserDto(username, password, ""));				
			});
		}

		var _login = function(user) {
			_userEventBus.post(user, events.userAuthenticatedEvent);
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

	var UserBoxComponent = function(_componentRootId) {

		var events = {
			createRoomButtonClickedEvent: "CREATE_ROOM_BUTTON_CLICK_EVENT",
			roomSuccessfullyCreatedEvent: "ROOM_SUCCESSFULLY_CREATED_EVENT",
			roomCreationFailedEvent: "ROOM_CREATION_FAILED_EVENT",
			failedRoomJoinEvent: "FAILED_ROOM_JOIN_EVENT",
			userSuccessfullyJoinedEvent: "USER_SUCCESSFULLY_JOINED_EVENT",
			joinRoomButtonClickedEvent: "JOIN_ROOM_BUTTON_CLICKED_EVENT"
		}

		var _chatService = new ChatService(_userEventBus ,_storage);

		var roomsCounter = 0;

		var _init = function() {
			_userEventBus.subscribe(events.createRoomButtonClickedEvent, _chatService.onChatAdded);
			_userEventBus.subscribe(events.roomSuccessfullyCreatedEvent, _onRoomSuccessfullyCreated);
			_userEventBus.subscribe(events.roomCreationFailedEvent, _onRoomCreationFailed);
			_userEventBus.subscribe(events.joinRoomButtonClickedEvent, _chatService.onUserJoined);
			_userEventBus.subscribe(events.userSuccessfullyJoinedEvent, _onUserSuccessfullyJoined);
			_userEventBus.subscribe(events.failedRoomJoinEvent, _onRoomCreationFailed);

			_render();

			$("#" + _componentRootId + " .new-room").click(function() {
				_userEventBus.post($("#" + _componentRootId + " .room-name").val(), events.createRoomButtonClickedEvent);
			});

			$("#" + _componentRootId + " .join-room").click(function() {
				_userEventBus.post({username: $("#u-name").val(), 
					title: $("#" + _componentRootId + " .room-name").val()}, events.joinRoomButtonClickedEvent);
			});
		}

		var _render = function() {
			$('<div></div>')
				.appendTo("#" + _rootId + " .main-content")
				.addClass('container user-box')
				.attr("id", _componentRootId)
					.append($('<font>')
						.html('User: ' + $("#u-name").val()))
					.append($('<input/>')
						.attr('type', 'button')
						.addClass('new-room')
						.val('New chat'))
					.append($('<input/>')
						.attr('type', 'button')
						.addClass('join-room')
						.val('Join chat'))
					.append($('<input/>')
						.attr('type', 'text')
						.addClass('room-name')
						.attr('placeholder', 'Chat name'))
					.append($('<font>')
						.attr('color', 'red')
						.addClass('error'));
		}

		var _onRoomCreationFailed = function(message) {
			$("#" + _componentRootId + " .error").html(message);
		}

		var _onRoomSuccessfullyCreated = function(_roomTitle) {
			$("#" + _componentRootId + " .error").html("");
			$("#" + _componentRootId + " .room-name").val("");
		}

		var _onUserSuccessfullyJoined = function(roomTittle) {
			if (typeof _components["rooms"] === 'undefined') {
				_components["rooms"] = [];
			}

			var newRoom = ChatRoomComponent(roomTittle);
			newRoom.init();

			_components.rooms.push(newRoom);

			$("#" + _componentRootId + " .error").html("");
			$("#" + _componentRootId + " .room-name").val("");
		}

		return {
			"init": _init
		}
	}

	var ChatRoomComponent = function(_chatName) {

		var chatRoomEvents = {
			messageAddedEvent: "MESSAGE_ADDED_EVENT",
			messageSuccessfullyAddedEvent: "MESSAGE_SUCCESSFULLY_ADDED_EVENT",
			messageAdditionFailedEvent: "MESSAGE_ADDITION_FAILED_EVENT",
			messagesListUpdatedEvent: "MESSAGES_LIST_UPDATED_EVENT"
		}

		var _componentRootId = _chatName.replace(/ /g,"_");

		var _chatRoomEventBus = new EventBus();

		var _messageService = new MessageService(_chatRoomEventBus, _storage, _componentRootId);

		_chatRoomComponents = {};

		var _chatRoomDomContent;

		var _init = function() {
			_render();

			_chatRoomDomContent = $("#" + _componentRootId + " .chat-room-content");

			_chatRoomComponents.messageListComponent = MessageListComponent();
			_chatRoomComponents.addMessageComponent = AddMessageComponent();

			_chatRoomEventBus.subscribe(chatRoomEvents.messageAddedEvent, _messageService.onMessageAdded);
			_chatRoomEventBus.subscribe(chatRoomEvents.messageSuccessfullyAddedEvent, _chatRoomComponents.addMessageComponent.onMessageSuccessfullyAdded);
			_chatRoomEventBus.subscribe(chatRoomEvents.messageAdditionFailedEvent, _chatRoomComponents.addMessageComponent.onMessageAdditionFailed);
			_chatRoomEventBus.subscribe(chatRoomEvents.messageSuccessfullyAddedEvent, _chatRoomComponents.messageListComponent.onMessageListUpdated);

			Object.keys(_chatRoomComponents).forEach(function(key) {
				_chatRoomComponents[key].init();
			});
		}

		var _render = function() {
			$('<div>' + _chatName + '</div>')
				.appendTo("#" + _rootId + " .main-content")
				.addClass('container')
					.attr('id', _componentRootId)
						.append($('<div>')
							.addClass('chat-room-content'));
		}

		var AddMessageComponent = function() {

			var _init = function() {
				$('<textarea>')
					.appendTo(_chatRoomDomContent)
						.attr('placeholder', 'Type message here')
						.addClass('message-input-box');
				$('<input/>')
					.appendTo(_chatRoomDomContent)
						.attr('type', 'button')
						.attr('value', 'Send')
						.addClass('send-message-btn');
				$('<font>')
					.appendTo(_chatRoomDomContent)
						.attr('color', 'red')
						.addClass('error');

				$(_chatRoomDomContent).children(".send-message-btn").click(function() {
					var message = MessageDto($("#u-name").val(), $(_chatRoomDomContent).children(".message-input-box").val());

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
					.addClass('container text-container messages');

				_onMessageListUpdated([]);
			}

			var _onMessageListUpdated = function(messages) {
				var messageBox = $(_chatRoomDomContent).children(".messages");
				messageBox.html("<p>Hi " + $("#u-name").val() + "!</p>");
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