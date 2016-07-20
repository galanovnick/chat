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
		$("#" + _rootId + " .main-content").mustache('chat-room-template', {id: _componentRootId, chatname: _chatName});

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

			_chatRoomDomContent.mustache('add-message-template');

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
			_chatRoomDomContent.mustache('message-list-template');

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

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return ChatRoomComponent;
});