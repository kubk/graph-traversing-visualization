import { EventEmitter } from '../src/model/event-emitter';

class EventEmitterLike extends EventEmitter {}

describe('EventManagerMixin', () => {
  const behaveLikeEventManager = new EventEmitterLike();

  it('calls handler when event is triggered', () => {
    const handler = jest.fn();
    behaveLikeEventManager.on('foo', handler);

    expect(handler).toBeCalledTimes(0);
    behaveLikeEventManager.trigger('foo');
    expect(handler).toBeCalledTimes(1);
  });

  it('calls handler with arguments', () => {
    const handler = jest.fn();

    behaveLikeEventManager.on('foo', handler);
    behaveLikeEventManager.trigger('foo', 1, 2, 3);

    expect(handler).toBeCalledWith(1, 2, 3);
  });

  it('calls multiple listeners', () => {
    const handler = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();

    behaveLikeEventManager.on('foo', handler);
    behaveLikeEventManager.on('foo', handler2);
    behaveLikeEventManager.on('foo', handler3);
    behaveLikeEventManager.trigger('foo');

    expect(handler).toBeCalledTimes(1);
    expect(handler2).toBeCalledTimes(1);
    expect(handler3).toBeCalledTimes(1);
  });

  it('always calls listeners', () => {
    const handler = jest.fn();

    behaveLikeEventManager.on('foo', handler);

    behaveLikeEventManager.trigger('foo');
    behaveLikeEventManager.trigger('foo');
    behaveLikeEventManager.trigger('foo');

    expect(handler).toBeCalledTimes(3);
  });
});
