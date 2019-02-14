import { Multiling } from '../../../../../models/multiling';
import { Answer } from '../../../../../models/answer';

export interface BarData {
  label?: Multiling;
  answers?: Array<Answer>;
  absolutePercentage?: string;
  relativePercentage?: string;
  color?: string;
  count?: number;
  positive?: boolean;
  identifier?: string;
}
