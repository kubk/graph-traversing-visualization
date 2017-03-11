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
        var handlers = [].slice.call(arguments, 1);
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = [];
        }
        var that = this;
        handlers.forEach(function (handler) {
            that._eventHandlers[eventName].push(handler);
        });
    };

    /**
     * @param {*} eventName
     * @return {boolean}
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