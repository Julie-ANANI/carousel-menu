import { Professional } from './professional';

export interface SearchTool {
  metadata?: {
    world?: number;
    continent?: {
      Asia?: number;
      Africa?: number;
      Australia?: number;
      Europe?: number;
      'North America'?: number;
      'South America'?: number;
    }
  },

  pros?: Array<{
    readonly _id?: string;
    keywords?: Array<string>;
    score?: number;
    isLoading?: boolean;
    person?: Professional
  }>

}
