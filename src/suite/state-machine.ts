/* eslint-disable @typescript-eslint/ban-types */
import { Machine, assign, interpret } from 'xstate';

interface Context {
  total: number,
  passed: number,
  failed: number,
  skipped: number,
}

interface Schema {
  states: {
    idle: {},
    processing: {
      states: {
        finding_component: {},
        no_components: {},
        processing_component: {
          states: {
            idle: {},
            finding_story: {},
            finding_story_for_skipped_component: {},
            no_stories: {},
            processing_story: {
              states: {
                idle: {},
                running_axe: {},
                passed: {},
                failed: {},
                skipped: {},
              },
            },
            processing_story_for_skipped_component: {
              states: {
                idle: {},
                skipped: {},
              },
            },
          },
        },
      },
    },
    passed: {},
    failed: {},
  },
}

type Event =
  | { type: 'SUITE_START' }
  | { type: 'COMPONENT_FOUND' }
  | { type: 'COMPONENT_NOT_FOUND' }
  | { type: 'COMPONENT_SKIPPED' }
  | { type: 'COMPONENT_START' }
  | { type: 'STORY_FOUND' }
  | { type: 'STORY_NOT_FOUND' }
  | { type: 'STORY_SKIPPED' }
  | { type: 'STORY_START' }
  | { type: 'STORY_PASSED' }
  | { type: 'STORY_FAILED' }

/**
 * @see https://xstate.js.org/viz/?gist=718ff22ce921013a67b2d8d04f33531a
 */
const suiteMachine = Machine<Context, Schema, Event>(
  {
    id: 'suite',
    context: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          SUITE_START: 'processing',
        },
      },
      processing: {
        initial: 'finding_component',
        states: {
          finding_component: {
            on: {
              COMPONENT_FOUND: 'processing_component',
              COMPONENT_NOT_FOUND: 'no_components',
            },
          },
          no_components: {
            type: 'final',
          },
          processing_component: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  COMPONENT_SKIPPED: 'finding_story_for_skipped_component',
                  COMPONENT_START: 'finding_story',
                },
              },
              finding_story: {
                on: {
                  STORY_FOUND: 'processing_story',
                  STORY_NOT_FOUND: 'no_stories',
                },
              },
              finding_story_for_skipped_component: {
                on: {
                  STORY_FOUND: 'processing_story_for_skipped_component',
                  STORY_NOT_FOUND: 'no_stories',
                },
              },
              no_stories: {
                type: 'final',
              },
              processing_story: {
                initial: 'idle',
                states: {
                  idle: {
                    on: {
                      STORY_SKIPPED: {
                        target: 'skipped',
                        actions: ['captureSkipped', 'captureTotal'],
                      },
                      STORY_START: 'running_axe',
                    },
                  },
                  running_axe: {
                    on: {
                      STORY_PASSED: {
                        target: 'passed',
                        actions: ['capturePassed', 'captureTotal'],
                      },
                      STORY_FAILED: {
                        target: 'failed',
                        actions: ['captureFailed', 'captureTotal'],
                      },
                    },
                  },
                  passed: {
                    type: 'final',
                  },
                  failed: {
                    type: 'final',
                  },
                  skipped: {
                    type: 'final',
                  },
                },
                onDone: {
                  target: 'finding_story',
                },
              },
              processing_story_for_skipped_component: {
                initial: 'idle',
                states: {
                  idle: {
                    on: {
                      STORY_SKIPPED: {
                        target: 'skipped',
                        actions: ['captureSkipped', 'captureTotal'],
                      },
                      STORY_START: {
                        target: 'skipped',
                        actions: ['captureSkipped', 'captureTotal'],
                      },
                    },
                  },
                  skipped: {
                    type: 'final',
                  },
                },
                onDone: {
                  target: 'finding_story',
                },
              },
            },
            onDone: {
              target: 'finding_component',
            },
          },
        },
        onDone: [
          { target: 'passed', cond: 'hasNoFailed' },
          { target: 'failed', cond: 'hasFailed' },
        ],
      },
      passed: {
        type: 'final',
      },
      failed: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      captureSkipped: assign({
        skipped: (context) => context.skipped + 1,
      }),
      captureFailed: assign({
        failed: (context) => context.failed + 1,
      }),
      capturePassed: assign({
        passed: (context) => context.passed + 1,
      }),
      captureTotal: assign({
        total: (context) => context.total + 1,
      }),
    },
    guards: {
      hasFailed: (context) => context.failed > 0,
      hasNoFailed: (context) => context.failed === 0,
    },
  },
);

/**
 * Create a state machine representing the test suite.
 */
export default function createMachine() {
  return interpret(suiteMachine);
}
