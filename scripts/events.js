var events = {
	userAddedEvent : "USER_ADDED_EVENT",
	registrationFailedEvent : "REGISTRATION_FAILED_EVENT",
	successfulRegistrationEvent: "SUCCESSFUL_REGISTRATION_EVENT",
	userAuthenticatedEvent: "USER_AUTHENTICATED_EVENT",
	authenticationFailedEvent: "AUTHENTICATION_FAILED_EVENT",
	successfulAuthenticationEvent: "SUCCESSFUL_AUTHENTICATION_EVENT",

	messageAdditionFailedEvent: "MESSAGE_ADDITION_FAILED_EVENT",
	messageSuccessfullyAddedEvent: "MESSAGE_SUCCESSFULLY_ADDED_EVENT",
	messageAddedEvent: "MESSAGE_ADDED_EVENT",
	messagesListUpdatedEvent: "MESSAGES_LIST_UPDATED_EVENT",

	roomSuccessfullyCreatedEvent: "ROOM_SUCCESSFULLY_CREATED_EVENT",
	roomCreationFailedEvent: "ROOM_CREATION_FAILED_EVENT",
	failedRoomJoinEvent: "FAILED_ROOM_JOIN_EVENT",
	userSuccessfullyJoinedEvent: "USER_SUCCESSFULLY_JOINED_EVENT",
	userSuccessfullyLeftEvent: "USER_SUCCESSFULLY_LEFT_EVENT",

	createRoomButtonClickedEvent: "CREATE_ROOM_BUTTON_CLICK_EVENT",
	joinRoomButtonClickedEvent: "JOIN_ROOM_BUTTON_CLICKED_EVENT",
	leaveRommButtonClickedEvent: "LEAVE_ROOM_BUTTON_CLICKED_EVENT"
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
	return events;
});