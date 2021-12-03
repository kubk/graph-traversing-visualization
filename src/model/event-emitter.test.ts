import { EventEmitter } from './event-emitter';

type MyEvents = {
  foo: () => void;
  bar: (a: number, b: number, c: number) => void;
};

class EventEmitterLike extends EventEmitter<MyEvents> {}

describe('EventEmitter', () => {
  const eventEmitter = new EventEmitterLike();

  it('calls handler when event is triggered', () => {
    const handler = jest.fn();
    eventEmitter.on('foo', handler);

    expect(handler).toBeCalledTimes(0);
    eventEmitter.trigger('foo');
    expect(handler).toBeCalledTimes(1);
  });

  it('calls handler with arguments', () => {
    const handler = jest.fn();

    eventEmitter.on('bar', handler);
    eventEmitter.trigger('bar', 1, 2, 3);

    expect(handler).toBeCalledWith(1, 2, 3);
  });

  it('calls multiple listeners', () => {
    const handler = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();

    eventEmitter.on('foo', handler);
    eventEmitter.on('foo', handler2);
    eventEmitter.on('foo', handler3);
    eventEmitter.trigger('foo');

    expect(handler).toBeCalledTimes(1);
    expect(handler2).toBeCalledTimes(1);
    expect(handler3).toBeCalledTimes(1);
  });

  it('always calls listeners', () => {
    const handler = jest.fn();

    eventEmitter.on('foo', handler);

    eventEmitter.trigger('foo');
    eventEmitter.trigger('foo');
    eventEmitter.trigger('foo');

    expect(handler).toBeCalledTimes(3);
  });
});
