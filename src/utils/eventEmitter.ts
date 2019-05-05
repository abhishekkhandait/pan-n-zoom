type Listener = (...args: any[]) => void;

export default class EventEmitter {
  private readonly events: Map<string, Array<Listener>>;

  constructor() {
    this.events = new Map<string, Array<Listener>>();
  }

  public on(eventName: string, listener: Listener) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    const eventListeners = this.events.get(eventName);
    eventListeners.push(listener);
    this.events.set(eventName, eventListeners);
  }

  public emit(eventName: string, ...args: any[]) {
    const eventListeners = this.events.get(eventName);
    if (eventListeners) {
      eventListeners.forEach((listener: Listener) => {
        listener.apply(this, args);
      });
    }
  }

  public once(eventName: string, listener: Listener) {
    const _listener = (...args: any[]) => {
      this.removeListener(eventName, listener);
      listener.apply(this, args);
    };
    this.on(eventName, _listener);
  }

  public removeListener(eventName: string, listener: Listener) {
    const listeners = this.events.get(eventName);
    if (listeners) {
      const newListenerArray = listeners.filter(
        _listener => !listeners.includes(listener)
      );
      this.events.set(eventName, newListenerArray);
    }
  }

  public removeAllListners(eventName: string) {
    this.events.delete(eventName);
  }
}
