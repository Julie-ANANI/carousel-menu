/**
 * not use anymore. Only for Old innovation with not mission templates value.
 */

import { Question } from './question';
import {UmiusMultilingInterface} from '@umius/umi-common-component';

export interface PresetSectionEntry {
  lang: string;
  label: string;
}

// TODO remove multiling
export interface PresetSection {
  readonly description: 'nothing' | '1st' | '2nd';
  readonly questions: Array<Question>;

  /**
   * TODO uncomment this
   */
  // readonly entry?: Array<PresetSectionEntry>;

  /**
   * TODO remove this
   */
  readonly label: UmiusMultilingInterface;
}

export interface PresetRequirement {
  lang: string;
  text: string;
}

export interface Preset {
  _id?: string;
  name: string;
  accessibility?: {
    editable: boolean;
    hidden: boolean;
  },
  requirements?: Array<PresetRequirement>;
  readonly sections: Array<PresetSection>;
  readonly created?: Date;
  readonly updated?: Date;
}
