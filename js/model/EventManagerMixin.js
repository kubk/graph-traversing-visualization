function EventManagerMixin() {
    this._eventHandlers = {};

    this.on = function (eventName) {
        var that = this;
        var handlers = [].slice.call(arguments, 1);
        handlers.forEach(function (handler) {
            if (!that._eventHandlers[eventName]) {
                that._eventHandlers[eventName] = [];
            }
            that._eventHandlers[eventName].push(handler);
        });
    };

    this.trigger = function (eventName) {
        if (!this._eventHandlers[eventName]) {
            return false;
        }

        var handlerArguments = [].slice.call(arguments, 1);
        this._eventHandlers[eventName].forEach(function (handler) {
            handler.apply(this, handlerArguments);
        });
    };
}

