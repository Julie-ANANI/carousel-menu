import { Professional } from '../professional';

export interface SearchTool {
  metadata?: {
    world?: number;
    asia?: number;
    africa?: number;
    oceania?: number;
    europe?: number;
    northAmerica?: number;
    southAmerica?: number;
  },

  pros?: Array<{
    readonly _id?: string;
    keywords?: Array<string>;
    score?: number;
    isLoading?: boolean;
    person?: Professional
  }>

}
