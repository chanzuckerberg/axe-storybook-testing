import { createEmitter } from '../../src/Emitter';

test('emitting events with no type param', () => {
  const emitter = createEmitter();
  const handler = jest.fn();

  emitter.on('foo-bear', handler);
  emitter.emit('foo-baz');
  expect(handler).not.toHaveBeenCalled();

  emitter.emit('foo-bear');
  expect(handler).toHaveBeenCalled();
});

test('emitting events with an explicit type param', () => {
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
