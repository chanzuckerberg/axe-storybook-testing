import type { Options } from '../Options';
import { SuiteEmitter } from '../Suite';
import * as SpecFormat from './Spec';

type Formatter = (emitter: SuiteEmitter) => void;

export default function findFormat(options: Options): Formatter {
  switch (options.format) {
    case 'spec':
      return SpecFormat.format;
  }
}
