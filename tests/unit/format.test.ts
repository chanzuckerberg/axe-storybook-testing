import dedent from 'ts-dedent';
import { createEmitter } from '../../src/Emitter';
import format from '../../src/format';
import { SuiteEvents } from '../../src/Suite';

test('suiteStart', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('suiteStart', 'mosaic');
  expect(print).toHaveBeenCalledWith('[mosaic] accessibility');
});

test('componentStart', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('componentStart', 'button');
  expect(print).toHaveBeenCalledWith('  button');
});

test('componentSkip', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('componentSkip', 'button');
  expect(print).toHaveBeenCalledWith('  [skipped] button');
});

test('storyPass', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print);
  expect(print).not.toHaveBeenCalled();

  const result = {
    component: 'some component',
    name: 'some story',
    violations: [],
  };

  emitter.emit('storyPass', 'some story', result, 666);
  expect(print).toHaveBeenCalledWith('    ✓ some story (666ms)');
});

test('storyFail', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print);
  expect(print).not.toHaveBeenCalled();

  const result = {
    component: 'some component',
    name: 'some story',
    violations: [],
  };

  emitter.emit('storyFail', 'some story 1', result, 666);
  expect(print).toHaveBeenCalledWith('    1) some story 1 (666ms)');

  emitter.emit('storyFail', 'some story 2', result, 666);
  expect(print).toHaveBeenCalledWith('    2) some story 2 (666ms)');
});

test('storySkip', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('storySkip', 'some story');
  expect(print).toHaveBeenCalledWith('    - some story');
});

test('suiteFinish', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print);
  expect(print).not.toHaveBeenCalled();

  const result = {
    component: 'Some component name',
    name: 'Some story name',
    violations: [
      {
        description: 'Ensures buttons have discernible text',
        help: 'Buttons must have discernible text',
        helpUrl: 'https://dequeuniversity.com/rules/axe/3.5/button-name',
        id: 'button-name',
        tags: ['wcag2a', 'section508'],
        nodes: [
          {
            html: '<button></button>',
            target: [],
            any: [],
            all: [],
            none: [],
          },
        ],
      },
    ],
  };

  emitter.emit('suiteStart', 'ie6');
  emitter.emit('storyFail', 'some story 1', result, 666);
  emitter.emit('suiteFinish', 0, 1, 0, 666 );

  expect(print).toHaveBeenCalledWith(dedent`
    0 passing
    1 failing
    0 pending
  `);
});
