var ChatApp = function(_rootId, _userEventBus, _userService) {

	var events = {
		userAddedEvent : "USER_ADDED_EVENT",
		userListUpdatedEvent: "USER_LIST_UPDATED_EVENT",
		registrationFailedEvent : "REGISTRATION_FAILED_EVENT"
	}

	var _components = {};

	var _init = function() {

		_components.registration = RegistrationComponent("reg_" + _rootId);
		_components.userList = UserListComponent("u_list_" + _rootId);

		_userEventBus.subscribe(events.userAddedEvent, _userService.create);
		_userEventBus.subscribe(events.userListUpdatedEvent, _components.userList.render);
		_userEventBus.subscribe(events.userListUpdatedEvent, _components.registration.resetFields);
		_userEventBus.subscribe(events.registrationFailedEvent, _components.registration.registrationFailed);

		Object.keys(_components).forEach(function(key) {

			_components[key].init();
		});
	}

	var RegistrationComponent = function(_componentRootId) {

		var _init = function() {
			var root = document.getElementById(_rootId);

			var componentDiv = document.createElement('div');
			componentDiv.id = _componentRootId;
			componentDiv.style = 'width: 200px; height: 205px; padding:20px; margin:10px; border: 2px solid black; border-radius: 10px;';
			componentDiv.innerHTML = '<div style=padding:10px>Registration</div>' +
				'<div style=padding:10px><input type="text" id="username" placeholder="Username"/></div>' +
				'<div style=padding:10px><input type="password" id="password" placeholder="Password"/></div>' +
				'<div style=padding:10px><input type="password" id="password_r" placeholder="Repeate password"/></div>' +
				'<div style=padding:10px><input type="button" id="register" value="Register"/></div>';

			root.appendChild(componentDiv);

			document.getElementById("register").onclick = function() {
				var username = document.getElementById("username").value;
				var password = document.getElementById("password").value;
				var password_r = document.getElementById("password_r").value;

				_register(User(username, password, password_r));				
			}
		}

		var _register = function(user) {
			console.log("Trying to post 'userAddedEvent' (user = " + user.username + ")...")
			_userEventBus.post(user, events.userAddedEvent);

		}

		var _registrationFailed = function(message) {
			var errorComponent = document.getElementById("reg_error");

			if (errorComponent === null) {
				var componentRootElem = document.getElementById(_componentRootId);

				var errorComponent = document.createElement('div');
				errorComponent.innerHTML = '<font id = "reg_error" color="red" style=padding:10px;>' + message + '</font>';

				componentRootElem.appendChild(errorComponent);
			} else {
				errorComponent.innerHTML = message;
			}
		}

		var _resetFields = function() {
			var errorElem = document.getElementById("reg_error");
			if (errorElem !== null) {
				errorElem.innerHTML = "";
			}

			document.getElementById("username").value = "";
			document.getElementById("password").value = "";
			document.getElementById("password_r").value = "";
		}

		return {
			"init": _init,
			"register": _register,
			"registrationFailed": _registrationFailed,
			"resetFields": _resetFields
		}
	}

	var UserListComponent = function(_componentRootId) {

		var _init = function() {
			var root = document.getElementById(_rootId);

			var componentDiv = document.createElement('div');

			componentDiv.id = _componentRootId;
			componentDiv.style = 'width: 200px; height: 200px; padding:20px; margin:10px; border: 2px solid black; border-radius: 10px;';
			componentDiv.innerHTML = '<div style=padding:10px>Registered users:</div><div id="users"></div>';

			root.appendChild(componentDiv);

			_render(_userService.getAll());
		}

		var _render = function(users) {
			var usersDiv = document.getElementById("users");
			usersDiv.innerHTML = "";

			Object.keys(users).forEach(function(username) {
				var userDiv = document.createElement('div');
				userDiv.style = 'padding: 10px';
				userDiv.innerHTML = 'Username: ' + username;

				usersDiv.appendChild(userDiv);
			});
		}

		return {
			"init": _init,
			"render": _render
		}
	}

	var User = function(username, password, password_r) {
		return {
			"username": username,
			"password": password,
			"password_r": password_r
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