'use strict';

var assert = require('chai').assert;
var EventManagerMixin = require('../src/model/EventManagerMixin');
var sinon = require('sinon');

describe('EventManagerMixin', function () {
    var behaveLikeEventManager = new function () {
        EventManagerMixin.call(this);
    };

    it('calls handler when event is triggered', function () {
        var handler = sinon.spy();
        behaveLikeEventManager.on('foo', handler);

        assert.isTrue(handler.notCalled);
        behaveLikeEventManager.trigger('foo');
        assert.isTrue(handler.calledOnce);
    });

    it('calls handler with arguments', function () {
        var handler = sinon.spy();

        behaveLikeEventManager.on('foo', handler);
        behaveLikeEventManager.trigger('foo', 1, 2, 3);

        assert.isTrue(handler.calledWith(1, 2, 3));
    });

    it('calls multiple listeners', function () {
        var handler = sinon.spy();
        var handler2 = sinon.spy();
        var handler3 = sinon.spy();

        behaveLikeEventManager.on('foo', handler);
        behaveLikeEventManager.on('foo', handler2);
        behaveLikeEventManager.on('foo', handler3);
        behaveLikeEventManager.trigger('foo');

        assert.isTrue(handler.calledOnce);
        assert.isTrue(handler2.calledOnce);
        assert.isTrue(handler3.calledOnce);
    });

    it('always calls listeners', function () {
        var handler = sinon.spy();

        behaveLikeEventManager.on('foo', handler);

        behaveLikeEventManager.trigger('foo');
        behaveLikeEventManager.trigger('foo');
        behaveLikeEventManager.trigger('foo');

        assert.isTrue(handler.calledThrice);
    });
});
