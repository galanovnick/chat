var ChatApp = function(rootId) {

	var events = {
		userAddedEvent : 0,
		usersListUpdatedEvent: 1,
		registrationFailedEvent : 2
	}

	var components = [];

	var usersEventBus = EventBus();

	var _init = function() {
		console.log("root initialized");

		components["usersContainer"] = UsersContainer();
		components["registration"] = RegistrationComponent();
		components["usersList"] = UsersListComponent();

		usersEventBus.subscribe(events.userAddedEvent, components["usersContainer"].add);
		usersEventBus.subscribe(events.usersListUpdatedEvent, components["usersList"].render);
		usersEventBus.subscribe(events.registrationFailedEvent, components["registration"].registratinFailed);
	}

	var RegistrationComponent = function(resutrationComponentRootId) {

		var _register = function(user) {

		}

		var _registrationFailed = function(message) {
			
		}

		return {
			"register": _register,
			"registrationFailed": _registrationFailed
		}
	}

	var UsersListComponent = function(usersListComponentRootId) {

		var _render = function(users) {

		}

		return {
			"render": _render
		}
	}

	var UsersContainer = function() {
		var storage = [];

		var _add = function(user) {
			
		}

		var _getAll = function() {

		}

		return {
			"add": _add,
			"getAll": _getAll
		}
	}

	return {"init" : _init};
}