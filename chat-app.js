var ChatApp = function(rootId) {
	var components = [];
	var _init = function() {
		console.log("root initialized");

		components["usersContainer"] = UsersContainer();
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