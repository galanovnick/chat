var UsersContainer = function(usersStorage) {

	var storage;

	if (typeof usersStorage === 'undefined' || usersStorage === null) {
		storage = {};
	} else {
		storage = usersStorage;
	}

	//storage = {};

	var _add = function(user) {
		storage[user.username] = user.password;
	}

	var _getAll = function() {
		return storage;
	}

	return {
		"add": _add,
		"getAll": _getAll
	}
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports.UsersContainer = UsersContainer;
}