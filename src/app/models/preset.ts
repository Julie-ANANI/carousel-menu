import { Section } from './section';

export interface Preset {
  _id: string;
  readonly sections: Array<Section>;
}
