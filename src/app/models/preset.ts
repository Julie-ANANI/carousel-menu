import { Section } from './section';


export interface PresetRequirement {
  lang: string,
  text: string
}

export interface Preset {

  _id?: string;

  name: string;

  readonly sections: Array<Section>;

  accessibility?: {
    editable: boolean,
    hidden: boolean
  },

  requirements?: Array<PresetRequirement>;

}
