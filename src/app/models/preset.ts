import { Multiling } from './multiling';
import { Question } from './question';

export interface PresetSection {
  readonly label: Multiling;
  readonly description: 'nothing' | '1st' | '2nd';
  readonly questions: Array<Question>;
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
