'use strict';

const assert = require('assert');
const Position = require('../src/model/Position');

describe('Position', () => {
    it('returns valid x and y', () => {
        const p = new Position(1, 2);

        assert.equal(1, p.getX());
        assert.equal(2, p.getY());
    });

    it('throws an exception when arguments are negative', () => {
        assert.throws(() => {
            new Position(-1, 2);
        });
    });
});
