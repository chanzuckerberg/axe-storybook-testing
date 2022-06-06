import { createEmitter } from '../../../src/suite/Emitter';

it('allows arbitrary events to be subscribed to and triggered', () => {
  const emitter = createEmitter();
  const handler = jest.fn();

  emitter.on('foo-bear', handler);
  emitter.emit('foo-baz');
  expect(handler).not.toHaveBeenCalled();

  emitter.emit('foo-bear');
  expect(handler).toHaveBeenCalled();
});

it('enforces specific event names when a type param is provided', () => {
  type Events = {
    bakingStarted: (cookies: boolean, coffee: boolean) => void;
  };

  const emitter = createEmitter<Events>();
  const handler = jest.fn();

  emitter.on('bakingStarted', handler);
  // @ts-expect-error Unknown events are a type error
  emitter.emit('foobear');
  expect(handler).not.toHaveBeenCalled();

  emitter.emit('bakingStarted', true, false);
  expect(handler).toHaveBeenCalledWith(true, false);
});
