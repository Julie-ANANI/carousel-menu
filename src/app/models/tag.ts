import { Multiling } from './multiling';
import { TagAttachment } from './tag-attachment';

/**
 * Created by juandavidcruzgomez on 28/03/2018.
 */
export interface Tag {
  _id?: string;
  readonly originalTagId?: string;
  readonly originalLabel?: Multiling;
  readonly label: Multiling;
  readonly description?: Multiling;
  readonly type?: 'UNKNOWN' | 'SECTOR' | 'VALUE_CHAIN' | 'SOLUTION_TYPE' | 'QUALIFICATION';
  readonly attachments?: Array<TagAttachment>;
  readonly status?: 'DRAFT' | 'VALID';
  readonly created?: Date;
  readonly updated?: Date;

}
