/**
 * Not use anymore. Only there to work with old presets.
 */

import { Question } from './question';
import {UmiusMultilingInterface} from '@umius/umi-common-component';

export interface SectionEntry {
  lang: string;
  label: string;
}

// TODO remove multiling
export interface Section {
  description: 'nothing' | '1st' | '2nd';
  readonly questions: Array<Question>;
  entry?: Array<SectionEntry>;

  /**
   * TODO replace this with Array<SectionLabel>
   */
  readonly label: UmiusMultilingInterface;
}
