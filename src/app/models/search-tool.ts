import { Professional } from './professional';

export interface SearchTool {
  world?: number;
  created?: Date;
  keywords?: Array<string>;
  person?: Professional;
  countries?: Array<string>;
}
