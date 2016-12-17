function EventManagerMixin() {
    this._eventHandlers = {};

    this.on = function (eventName) {
        var that = this;
        [].slice.call(arguments, 1).forEach(function (handler) {
            if (!that._eventHandlers[eventName]) {
                that._eventHandlers[eventName] = [];
            }
            that._eventHandlers[eventName].push(handler.bind(that));
        });
    };

    this.trigger = function (eventName) {
        if (!this._eventHandlers[eventName]) {
            return false;
        }
        this._eventHandlers[eventName].forEach(function (handler) {
            handler();
        });
    };
}

