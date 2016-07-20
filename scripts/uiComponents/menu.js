var UserMenuComponent = function(_componentRootId, _rootId, _eventBus, _storage) {

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

		$('#' + _rootId + " .main-content").mustache('user-menu-template', {id: _componentRootId, username: $("#u-name").val()});
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

		var newRoom = new ChatRoomComponent(roomTittle, _rootId, _eventBus);
		newRoom.init();

		$("#" + _componentRootId + " .error").html("");
		$("#" + _componentRootId + " .room-name").val("");
	}

	return {
		"init": _init
	}
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return UserMenuComponent;
});