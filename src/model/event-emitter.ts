export abstract class EventEmitter {
  private eventHandlers: any = {};

  on(eventName: string, ...handlers: any) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }

    this.eventHandlers[eventName].push(...handlers);
  }

  trigger(eventName: string, ...handlerArguments: any) {
    if (!this.eventHandlers[eventName]) {
      return;
    }

    this.eventHandlers[eventName].forEach((handler: any) => {
      handler.apply(this, handlerArguments);
    });
  }
}
