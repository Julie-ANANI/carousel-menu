import { Innovation } from './innovation';

export interface Response {
  result: Array<Innovation>;
  _metadata: any;
  [property: string]: any;
}
