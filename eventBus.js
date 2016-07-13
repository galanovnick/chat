var EventBus = function(createSubscriber) {

	var _subscribers = new Array();

	var _post = function(eventData, eventType) {
		if (eventType != undefined && !(eventType in _subscribers)) {
			return;
		}

		if (eventType != undefined) {
			for (var i = 0; i < _subscribers[eventType].length; i++) {

				_subscribers[eventType][i](eventData);

			}
		} else {
			Object.keys(_subscribers).forEach(function(eventTypeKey, index) {

				for (var i = 0; i < _subscribers[eventTypeKey].length; i++) {
					_subscribers[eventTypeKey][i](eventData);
				}

			});
		}
	};

	var _subscribe = function(eventType, callback) {
		if (typeof _subscribers[eventType] === 'undefined') {
			_subscribers[eventType] = new Array();
		}
		_subscribers[eventType].push(createSubscriber(callback));
	};

	return {
		"post": _post,
		"subscribe": _subscribe
	}
};

//module.exports.EventBus = EventBus;