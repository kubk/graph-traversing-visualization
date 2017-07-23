"use strict";

function EventManagerMixin() {
    this.eventHandlers = {};

    /**
     * @param {*} eventName
     * @param handlers
     */
    this.on = function (eventName, ...handlers) {
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }

        handlers.forEach((handler) => {
            this.eventHandlers[eventName].push(handler);
        });
    };

    /**
     * @param {*} eventName
     * @param handlerArguments
     */
    this.trigger = function (eventName, ...handlerArguments) {
        if (!this.eventHandlers[eventName]) {
            return;
        }

        this.eventHandlers[eventName].forEach((handler) => {
            handler.apply(this, handlerArguments);
        });
    }
}

module.exports = EventManagerMixin;
