import { EventEmitter } from 'events';

type EventMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: (...args: any[]) => void;
}

export interface Emitter<Events extends EventMap> {
  on<Name extends keyof Events>(event: Name, listener: Events[Name]): void;
  emit<Name extends keyof Events>(event: Name, ...args: Parameters<Events[Name]>): void;
}

export function createEmitter<Events extends EventMap>(): Emitter<Events> {
  // Cast to our custom Emitter type, since the event name type of Node EventEmitter's methods
  // don't match up. Is there a way to reconcile those and remove the cast?
  return new EventEmitter() as Emitter<Events>;
}
