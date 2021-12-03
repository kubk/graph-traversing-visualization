type Arguments<T> = T extends (...args: infer U) => any ? U : []

export abstract class EventEmitter<Events> {
  private handlers = new Map<keyof Events, Events[keyof Events][]>();

  on(event: keyof Events, ...handlers: Array<Events[keyof Events]>): void {
    if (this.handlers.has(event)) {
      const newHandlers = (this.handlers.get(event) || []).concat(handlers);
      this.handlers.set(event, newHandlers);
    } else {
      this.handlers.set(event, handlers);
    }
  }

  trigger(event: keyof Events, ...args: Arguments<Events[keyof Events]>): void {
    const handlers: any[] = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(...args));
  }
}
