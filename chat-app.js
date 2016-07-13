var ChatApp = function(rootId) {

	var events = {
		userAddedEvent : 0,
		usersListUpdatedEvent: 1,
		registrationFailedEvent : 2
	}

	var _components = {};

	var _usersContainer;

	var _usersEventBus;

	var _init = function() {
		_usersEventBus = EventBus(function(callback) {
			return function(eventData) {
				callback(eventData);
			}
		});

		_usersContainer = UsersContainer(localStorage.usersStorage ? JSON.parse(localStorage.usersStorage) : []);

		_components["registration"] = RegistrationComponent("reg_" + rootId);
		_components["usersList"] = UsersListComponent("u_list_" + rootId);

		Object.keys(_components).forEach(function(key) {
			_components[key].init();
		});

		_usersEventBus.subscribe(events.userAddedEvent, _usersContainer.add);
		_usersEventBus.subscribe(events.usersListUpdatedEvent, _components["usersList"].render);
		_usersEventBus.subscribe(events.registrationFailedEvent, _components["registration"].registrationFailed);

		document.getElementById("register").onclick = function() {

			var username = document.getElementById("username").value;
			var password = document.getElementById("password").value;
			var password_r = document.getElementById("password_r").value;

			if (username === "" || password === "") {
				_usersEventBus.post("Fields cannot be empty.", events.registrationFailedEvent);
				return;
			}

			if (password !== password_r) {
				_usersEventBus.post("Passwords do not match.", events.registrationFailedEvent);
				return;
			}

			user = {
				username: username,
				password: password,
			}
			_components["registration"].register(user);
		}

		window.onbeforeunload = function() {
			localStorage.usersStorage = JSON.stringify(_usersContainer.getAll());
		}
	}

	var RegistrationComponent = function(registrationComponentRootId) {

		var _componentRootId = registrationComponentRootId;

		var _init = function() {
			var root = document.getElementById(rootId);

			var componentDiv = document.createElement('div');
			componentDiv.id = _componentRootId;
			componentDiv.style = 'width: 200px; height: 185px; padding:20px; margin:10px; border: 2px solid black; border-radius: 10px;';
			componentDiv.innerHTML = '<div style=padding:10px><input type="text" id="username" placeholder="Username"/></div>' +
				'<div style=padding:10px><input type="password" id="password" placeholder="Password"/></div>' +
				'<div style=padding:10px><input type="password" id="password_r" placeholder="Repeate password"/></div>' +
				'<div style=padding:10px><input type="button" id="register" value="Register"/></div>';

			root.appendChild(componentDiv);
		}

		var _register = function(user) {
			if (user.username in _usersContainer.getAll()) {
				_usersEventBus.post("User with such name already exist.", events.registrationFailedEvent);
			} else {
				_usersEventBus.post(user, events.userAddedEvent);
			}
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

			setTimeout(function() {
				errorComponent.innerHTML = "";
			}, 1000);
		}

		return {
			"init": _init,
			"register": _register,
			"registrationFailed": _registrationFailed
		}
	}

	var UsersListComponent = function(usersListComponentRootId) {

		var _componentRootId = usersListComponentRootId;

		var _init = function() {
			var root = document.getElementById(rootId);

			var componentDiv = document.createElement('div');

			componentDiv.id = _componentRootId;
			componentDiv.style = 'width: 200px; height: 200px; padding:20px; margin:10px; border: 2px solid black; border-radius: 10px;';
			componentDiv.innerHTML = '<div style=padding:10px>Registered users:</div><div id="users"></div>';

			root.appendChild(componentDiv);
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

	var UsersContainer = function(usersStorage) {
		var storage = usersStorage;
		console.log(storage);

		var _add = function(user) {
			storage[user.username] = user.password;
			_usersEventBus.post(_getAll(), events.usersListUpdatedEvent);
		}

		var _getAll = function() {
			return storage;
		}

		return {
			"add": _add,
			"getAll": _getAll
		}
	}
	return {"init" : _init};
}

//module.exports.UsersContainer = UsersContainer;