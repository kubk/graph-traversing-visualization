"use strict";

module.exports = Position;

function Position(x, y) {
    this.setX(x);
    this.setY(y);
}

Position.prototype.setX = function (x) {
    if (x < 0) {
        throw new TypeError('Invalid argument');
    }
    this._x = x;
};

Position.prototype.setY = function (y) {
    if (y < 0) {
        throw new TypeError('Invalid argument');
    }
    this._y = y;
};

Position.prototype.getX = function () {
    return this._x;
};

Position.prototype.getY = function () {
    return this._y;
};