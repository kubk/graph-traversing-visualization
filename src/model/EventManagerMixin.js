"use strict";

module.exports = EventManagerMixin;

/**
 * Simple mixin for managing events
 *
 * @constructor
 */
function EventManagerMixin() {
    this._eventHandlers = {};
    
    /**
     * @param {*} eventName
     */
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

    /**
     * @param {*} eventName
     * @returns {boolean}
     */
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

