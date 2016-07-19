var ChatApp = function(_rootId) {

	var _storage = new Storage();
	var _eventBus = new EventBus();
	var _userService = new UserService(_eventBus, _storage);

	var _chatService;

	var _components = {};

	var _init = function() {

		_components.registrationComponent = new RegistrationComponent("reg-" + _rootId);
		_components.loginComponent = new UserLoginComponent("login-" + _rootId);

		_eventBus.subscribe(events.userAddedEvent, _userService.onUserAdded);
		_eventBus.subscribe(events.userAuthenticatedEvent, _userService.onUserAuthenticated);
		_eventBus.subscribe(events.successfulRegistrationEvent, _components.registrationComponent.onRegistrationSuccess);
		_eventBus.subscribe(events.registrationFailedEvent, _components.registrationComponent.onRegistrationFailed);
		_eventBus.subscribe(events.authenticationFailedEvent, _components.loginComponent.onUserAuthenticationFailed);
		_eventBus.subscribe(events.successfulAuthenticationEvent, _components.loginComponent.onUserSuccessfullyAuthenticated);
		_eventBus.subscribe(events.successfulAuthenticationEvent, _components.registrationComponent.onUserSuccessfullyAuthenticated);
		_eventBus.subscribe(events.successfulAuthenticationEvent, _createUserBox);

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
				.html('Registration</br>')
				.addClass('container')
				.appendTo('#' + _rootId + " .login-reg")
					.attr('id', _componentRootId)
						.append($('<input/>')
							.attr('type', 'text')
							.attr('placeholder', 'Username')
							.addClass('username'))
							.append($('<br/>'))
						.append($('<input/>')
							.attr('type', 'password')
							.attr('placeholder', 'Password')
							.addClass('password'))
							.append($('<br/>'))
						.append($('<input/>')
							.attr('type', 'password')
							.attr('placeholder', 'Repeate password')
							.addClass('password_r'))
							.append($('<br/>'))
						.append($('<input/>')
							.attr('type', 'button')
							.val('Register')
							.addClass('register'))
						.append($('<font>')
							.append($('<br/>'))
							.addClass('error')
							.attr('color', 'red'))
						.append($('<font>')
							.append($('<br/>'))
							.addClass('success')
							.attr('color', 'light-blue'));

			$("#" + _componentRootId + " .register").click(function() {
				var username = $("#" + _componentRootId + " .username").val();
				var password = $("#" + _componentRootId + " .password").val();
				var password_r = $("#" + _componentRootId + " .password_r").val();

				_register(new UserDto(username, password, password_r));				
			});
		}

		var _register = function(user) {
			console.log("Trying to post 'userAddedEvent' (user = " + user.username + ")...");
			_eventBus.post(user, events.userAddedEvent);

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
			$("#" + _componentRootId + " .success").html("");
		}

		var _onRegistrationSuccess = function() {
			_resetFields();
			$("#" + _componentRootId + " .success").html("User has been registered");
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
							.append($('<br/>'))
						.append($('<input/>')
							.attr('type', 'password')
							.attr('placeholder', 'Password')
							.addClass('password'))
							.append($('<br/>'))	
						.append($('<input/>')
							.attr('type', 'button')
							.val('Login')
							.addClass('login'))
							.append($('<br/>'))
						.append($('<font>')
							.addClass('error')
							.attr('color', 'red'));


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

	
	var UserBoxComponent = function(_componentRootId) {

		_chatService = new ChatService(_eventBus, _storage);

		var roomsCounter = 0;

		var _init = function() {
			_eventBus.subscribe(events.messageAddedEvent, _chatService.onMessageAdded);
			_eventBus.subscribe(events.createRoomButtonClickedEvent, _chatService.onChatAdded);
			_eventBus.subscribe(events.roomSuccessfullyCreatedEvent, _onRoomSuccessfullyCreated);
			_eventBus.subscribe(events.roomCreationFailedEvent, _onRoomCreationFailed);
			_eventBus.subscribe(events.joinRoomButtonClickedEvent, _chatService.onUserJoined);
			_eventBus.subscribe(events.userSuccessfullyJoinedEvent, _onUserSuccessfullyJoined);
			_eventBus.subscribe(events.failedRoomJoinEvent, _onRoomCreationFailed);

			_render();

			$("#" + _componentRootId + " .new-room").click(function() {
				_eventBus.post($("#" + _componentRootId + " .room-name").val(), events.createRoomButtonClickedEvent);
			});

			$("#" + _componentRootId + " .join-room").click(function() {
				_eventBus.post({username: $("#u-name").val(), 
					title: $("#" + _componentRootId + " .room-names").val()}, events.joinRoomButtonClickedEvent);
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
						.attr('type', 'text')
						.addClass('room-name')
						.attr('placeholder', 'Chat name'))
					.append($('font')
						.html('Available chat rooms:')
						.addClass('join-room-elem'))
					.append($('<select>')
						.addClass('room-names join-room-elem'))
					.append($('<input/>')
						.attr('type', 'button')
						.addClass('join-room join-room-elem')
						.val('Join chat'))
					.append($('<font>')
						.attr('color', 'red')
						.addClass('error'));
			showAvailableRooms();
		}

		var showAvailableRooms = function() {
			var chats = _chatService.getAllRooms();
			console.log(chats);
			if (chats.length > 0) {
				$('#' + _componentRootId + ' .room-names').html('');
				chats.forEach(function(chatName) {
					$('<option>')
						.appendTo('#' + _componentRootId + ' .room-names')
						.val(chatName)
						.html(chatName);
				});
				$('#' + _componentRootId + ' .join-room-elem').show()
			} else {
				$('#' + _componentRootId + ' .join-room-elem').hide()
			}
		}

		var _onRoomCreationFailed = function(message) {
			$("#" + _componentRootId + " .error").html(message);
		}

		var _onRoomSuccessfullyCreated = function(_roomTitle) {
			showAvailableRooms();
			$("#" + _componentRootId + " .error").html("");
			$("#" + _componentRootId + " .room-name").val("");
		}

		var _onUserSuccessfullyJoined = function(roomTittle) {
			if (typeof _components["rooms"] === 'undefined') {
				_components["rooms"] = [];
			}

			var newRoom = new ChatRoomComponent(roomTittle);
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

		var _componentRootId = _chatName.replace(/ /g,"_");

		_chatRoomComponents = {};

		var _chatRoomDomContent;

		var _init = function() {
			_render();

			_chatRoomDomContent = $("#" + _componentRootId + " .chat-room-content");

			_chatRoomComponents.messageListComponent = new MessageListComponent();
			_chatRoomComponents.addMessageComponent = new AddMessageComponent();

			_eventBus.subscribe(events.messageSuccessfullyAddedEvent, _chatRoomComponents.addMessageComponent.onMessageSuccessfullyAdded);
			_eventBus.subscribe(events.messageAdditionFailedEvent, _chatRoomComponents.addMessageComponent.onMessageAdditionFailed);
			_eventBus.subscribe(events.messageSuccessfullyAddedEvent, _chatRoomComponents.messageListComponent.onMessageListUpdated);

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
					var message = new MessageDto($("#u-name").val(), $(_chatRoomDomContent).children(".message-input-box").val(), _componentRootId);

					_eventBus.post(message ,events.messageAddedEvent);
				});
			}

			var _onMessageSuccessfullyAdded = function(roomInfo) {
				if (roomInfo.roomId === _componentRootId) {
					$(_chatRoomDomContent).children(".error").html("");
					$(_chatRoomDomContent).children(".message-input-box").val("");
				}
			}

			var _onMessageAdditionFailed = function(message) {
				if (message.roomId === _componentRootId) {
					$(_chatRoomDomContent).children(".error").html(message.text);
				}
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

				_onMessageListUpdated({roomId: _componentRootId, messages:[]});
			}

			var _onMessageListUpdated = function(roomMessages) {
				if (roomMessages.roomId === _componentRootId) {
					var messageBox = $(_chatRoomDomContent).children(".messages");
					messageBox.html("<p>Hi " + $("#u-name").val() + "!</p>");
					roomMessages.messages.forEach(function(message) {
						$('<p>' + message.username + ': ' + message.text + '</p>')
							.addClass('message-text')
							.appendTo(messageBox);
					});

					messageBox.scrollTop(Number.MAX_VALUE);
				}
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