'use strict';

const assert = require('chai').assert;
const EventManagerMixin = require('../src/model/EventManagerMixin');
const sinon = require('sinon');

describe('EventManagerMixin', () => {
    const behaveLikeEventManager = new function () {
        EventManagerMixin.call(this);
    };

    it('calls handler when event is triggered', () => {
        const handler = sinon.spy();
        behaveLikeEventManager.on('foo', handler);

        assert.isTrue(handler.notCalled);
        behaveLikeEventManager.trigger('foo');
        assert.isTrue(handler.calledOnce);
    });

    it('calls handler with arguments', () => {
        const handler = sinon.spy();

        behaveLikeEventManager.on('foo', handler);
        behaveLikeEventManager.trigger('foo', 1, 2, 3);

        assert.isTrue(handler.calledWith(1, 2, 3));
    });

    it('calls multiple listeners', () => {
        const handler = sinon.spy();
        const handler2 = sinon.spy();
        const handler3 = sinon.spy();

        behaveLikeEventManager.on('foo', handler);
        behaveLikeEventManager.on('foo', handler2);
        behaveLikeEventManager.on('foo', handler3);
        behaveLikeEventManager.trigger('foo');

        assert.isTrue(handler.calledOnce);
        assert.isTrue(handler2.calledOnce);
        assert.isTrue(handler3.calledOnce);
    });

    it('always calls listeners', () => {
        const handler = sinon.spy();

        behaveLikeEventManager.on('foo', handler);

        behaveLikeEventManager.trigger('foo');
        behaveLikeEventManager.trigger('foo');
        behaveLikeEventManager.trigger('foo');

        assert.isTrue(handler.calledThrice);
    });
});
