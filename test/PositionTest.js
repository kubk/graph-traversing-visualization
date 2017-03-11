'use strict';

var assert = require('assert');
var Position = require('../src/model/Position');

describe('Position', function () {
    it('returns valid x and y', function () {
        var p = new Position(1, 2);

        assert.equal(1, p.getX());
        assert.equal(2, p.getY());
    });

    it('throws an exception when arguments are negative', function () {
        assert.throws(function () {
            new Position(-1, 2);
        });
    });
});