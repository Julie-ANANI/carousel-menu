/**
 * Not use anymore. Only there to work with old presets.
 */

import { Question } from './question';
import { Multiling } from './multiling';

export interface SectionLabel {
  lang: string;
  value: string;
}

// TODO remove multiling
export interface Section {
  description: 'nothing' | '1st' | '2nd';
  readonly questions: Array<Question>;

  /**
   * TODO replace this with Array<SectionLabel>
   */
  readonly label: Multiling;
}
