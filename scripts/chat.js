//TODO: password check, wtf?
var ChatApp = function(_rootId) {

	$.Mustache.addFromDom('registration-template');
	$.Mustache.addFromDom('login-template');

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
		_eventBus.subscribe(events.successfulAuthenticationEvent, _createUserMenu);

		Object.keys(_components).forEach(function(key) {

			_components[key].init();
		});
	}

	var _createUserMenu = function() {
		_components.userBox = new UserMenuComponent("userBox");
		_components.userBox.init();
	}

	var RegistrationComponent = function(_componentRootId) {

		var _init = function() {
			$('#' + _rootId + " .login-reg").append(
				$.Mustache.render('registration-template', {id: _componentRootId})
			);

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

			$('#' + _rootId + " .login-reg").append(
				$.Mustache.render('login-template', {id: _componentRootId})
			);

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

	
	var UserMenuComponent = function(_componentRootId) {

		$.Mustache.addFromDom('user-menu-template');
		$.Mustache.addFromDom('chat-room-template');
		$.Mustache.addFromDom('add-message-template');
		$.Mustache.addFromDom('message-list-template');

		_chatService = new ChatService(_eventBus, _storage);

		var roomsCounter = 0;

		var _init = function() {
			_eventBus.subscribe(events.messageAddedEvent, _chatService.onMessageAdded);
			_eventBus.subscribe(events.createRoomButtonClickedEvent, _chatService.onRoomAdded);
			_eventBus.subscribe(events.roomSuccessfullyCreatedEvent, _onRoomSuccessfullyCreated);
			_eventBus.subscribe(events.roomCreationFailedEvent, _onRoomCreationFailed);
			_eventBus.subscribe(events.joinRoomButtonClickedEvent, _chatService.onUserJoined);
			_eventBus.subscribe(events.userSuccessfullyJoinedEvent, _onUserSuccessfullyJoined);
			_eventBus.subscribe(events.failedRoomJoinEvent, _onRoomCreationFailed);
			_eventBus.subscribe(events.leaveRommButtonClickedEvent, _chatService.onUserLeft);

			$('#' + _rootId + " .main-content").append(
				$.Mustache.render('user-menu-template', {id: _componentRootId, username: $("#u-name").val()})
			);
			showAvailableRooms();

			$("#" + _componentRootId + " .new-room").click(function() {
				_eventBus.post(new RoomDto($("#" + _componentRootId + " .room-name").val().replace(/ /g,"_")), events.createRoomButtonClickedEvent);
			});

			$("#" + _componentRootId + " .join-room").click(function() {
				_eventBus.post({username: $("#u-name").val(), 
					title: $("#" + _componentRootId + " .room-names").val().replace(/ /g,"_")}, events.joinRoomButtonClickedEvent);
			});
		}

		var showAvailableRooms = function() {
			var chats = _chatService.getAllRooms();
			if (chats.length > 0) {
				$('#' + _componentRootId + ' .room-names').html('');
				chats.forEach(function(chat) {
					$('<option>')
						.appendTo('#' + _componentRootId + ' .room-names')
						.val(chat.title)
						.html(chat.title);
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

		var _componentRootId = _chatName;

		_chatRoomComponents = {};

		var _chatRoomDomContent;

		var _init = function() {
			_render();

			_chatRoomComponents.messageListComponent = new MessageListComponent();
			_chatRoomComponents.addMessageComponent = new AddMessageComponent();

			_eventBus.subscribe(events.messageSuccessfullyAddedEvent, _chatRoomComponents.addMessageComponent.onMessageSuccessfullyAdded);
			_eventBus.subscribe(events.messageAdditionFailedEvent, _chatRoomComponents.addMessageComponent.onMessageAdditionFailed);
			_eventBus.subscribe(events.messageSuccessfullyAddedEvent, _chatRoomComponents.messageListComponent.onMessageListUpdated);
			_eventBus.subscribe(events.userSuccessfullyLeftEvent, _onUserLeft);

			Object.keys(_chatRoomComponents).forEach(function(key) {
				_chatRoomComponents[key].init();
			});
		}

		var _render = function() {
			$("#" + _rootId + " .main-content").append(
				$.Mustache.render('chat-room-template', {id: _componentRootId, chatname: _chatName})
			);

			_chatRoomDomContent = $('#' + _componentRootId + ' .chat-room-content');

			$('#' + _componentRootId + ' .leave-room').click(function() {
				_eventBus.post({roomId: _componentRootId, username: $('#u-name').val()}, events.leaveRommButtonClickedEvent);
			});
		}

		var _onUserLeft = function(roomId) {
			if (roomId === _componentRootId) {
				$('#' + _componentRootId).remove();
			}
		}

		var AddMessageComponent = function() {

			var _init = function() {

				_chatRoomDomContent.append(
					$.Mustache.render('add-message-template')
				);

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
				_chatRoomDomContent.append(
					$.Mustache.render('message-list-template')
				);

				_onMessageListUpdated({roomId: _componentRootId, messages: _chatService.getAllMessages(_componentRootId)});
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