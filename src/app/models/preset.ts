import { Section } from './section';

export interface Preset {
  _id?: string;
  name: string;
  readonly sections: Array<Section>;
}
