"use strict";

class Position {
    constructor(x, y) {
        this.setX(x);
        this.setY(y);
    }

    setX(x) {
        if (x < 0) {
            throw new TypeError('Invalid argument');
        }
        this.x = x;
    }

    setY(y) {
        if (y < 0) {
            throw new TypeError('Invalid argument');
        }
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

module.exports = Position;
