import chalk from 'chalk';
import dedent from 'ts-dedent';
import { createEmitter } from '../../../src/Emitter';
import { format } from '../../../src/formats/Spec';
import { SuiteEvents } from '../../../src/Suite';

const noColors = new chalk.Instance({ level: 0 });

test('suiteStart', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('suiteStart', 'mosaic');
  expect(print).toHaveBeenCalledWith('[mosaic] accessibility');
});

test('componentStart', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('componentStart', 'button');
  expect(print).toHaveBeenCalledWith('  button');
});

test('componentSkip', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('componentSkip', 'button');
  expect(print).toHaveBeenCalledWith('  [skipped] button');
});

test('storyPass', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
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

  format(emitter, print, noColors);
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

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('storySkip', 'some story');
  expect(print).toHaveBeenCalledWith('    - some story');
});

test('suiteFinish', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  const result = {
    component: 'Some component name',
    name: 'Some story name',
    violations: [
      {
        description: 'Ensures buttons have discernible text',
        help: 'Buttons must have discernible text',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.0/button-name',
        id: 'button-name',
        tags: [],
        nodes: [
          {
            html: '<button></button>',
            target: [],
            any: [],
            all: [],
            none: [],
            failureSummary: "Nope, that is not right, because\nIt's not",
          },
        ],
      },
    ],
  };

  emitter.emit('suiteStart', 'ie6');
  emitter.emit('storyFail', 'some story 1', result, 666);
  emitter.emit('suiteFinish', 0, 1, 0, 666 );

  expect(print).toHaveBeenCalledWith(dedent`
    0 passing (666ms)
    1 failing
    0 pending
  `);

  expect(print).toHaveBeenCalledWith(dedent`
    1) [ie6] accessibility
         Some component name
           Some story name

           Detected the following accessibility violations!

           1. button-name (Buttons must have discernible text)

              For more info, visit https://dequeuniversity.com/rules/axe/4.0/button-name.

              Check these nodes:

              - html: <button></button>
                summary: Nope, that is not right, because
                         It's not
  `);
});
