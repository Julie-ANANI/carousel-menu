import { Answer } from '../../../../../models/answer';
import {UmiusMultilingInterface} from '@umius/umi-common-component';

export interface BarData {
  label?: UmiusMultilingInterface;
  answers?: Array<Answer>;
  absolutePercentage?: string;
  relativePercentage?: string;
  color?: string;
  count?: number;
  positive?: boolean;
  identifier?: string;
  entry?: Array<any>;
}
