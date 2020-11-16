import { EventEmitter } from 'events';

/**
 * Mapping of event names to event handlers.
 */
type EventMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: (...args: any[]) => void;
}

export interface Emitter<Events extends EventMap> {
  on<Name extends keyof Events>(event: Name, listener: Events[Name]): void;
  emit<Name extends keyof Events>(event: Name, ...args: Parameters<Events[Name]>): void;
}

/**
 * Create an event emitter.
 *
 * By default it will accept any event names and event handlers. The events and the event handler
 * type signatures can be constrained by passing a type param.
 *
 * @example
 *
 * type Events = {
 *   eventA: (isChecked: boolean) => void;
 *   eventB: (name: string, phoneNumber: number) => void;
 * }
 *
 * const emitter = createEmitter<Events>();
 *
 * // TypeScript will enforce providing an event handler with the right type signature here.
 * emitter.on('eventB', (name, phoneNumber) => console.log(name, phoneNumber));
 */
export function createEmitter<Events extends EventMap>(): Emitter<Events> {
  // Cast to our custom Emitter type, since the event name type of Node EventEmitter's methods
  // don't match up. Is there a way to reconcile these and remove the cast?
  return new EventEmitter() as Emitter<Events>;
}
