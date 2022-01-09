/**
 * not use anymore. Only for Old innovation with not mission templates value.
 */

import { Multiling } from './multiling';
import { Question } from './question';

export interface PresetSectionLabel {
  lang: string;
  value: string;
}

// TODO remove multiling
export interface PresetSection {
  readonly description: 'nothing' | '1st' | '2nd';
  readonly questions: Array<Question>;
  readonly entry?: Array<PresetSectionLabel>;

  /**
   * TODO remove this
   */
  readonly label: Multiling;
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
