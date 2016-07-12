var EventBus = function() {

	var _workers = [];

	var _post = function(eventData, eventType) {
		if (eventType != undefined && !(eventType in _workers)) {
			return;
		}

		if (eventType != undefined) {

			for (var i = 0; i < _workers[eventType].length; i++) {

				_workers[eventType][i].postMessage(eventData);

			}
		} else {
			Object.keys(_workers).forEach(function(eventTypeKey, index) {

				for (var i = 0; i < _workers[eventTypeKey].length; i++) {
					
					_workers[eventTypeKey][i].postMessage(eventData);

				}
			});
		}
	};

	var _subscribe = function(eventType, callback) {
		if (typeof _workers[eventType] === 'undefined') {
			_workers[eventType] = [];
		}

		_workers[eventType].push(new Worker(
				window.URL.createObjectURL(
					new Blob(["onmessage = function(ev) {" + "(" + callback.toString() + ")(ev.data)};"]))
			)
		);
	};

	return {
		"post": _post,
		"subscribe": _subscribe
	}
};