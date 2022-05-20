import { TagAttachment } from './tag-attachment';
import {UmiusMultilingInterface} from "@umius/umi-common-component";

/**
 * Created by juandavidcruzgomez on 28/03/2018.
 */

export type TagType = 'UNKNOWN' | 'SECTOR' | 'VALUE_CHAIN' | 'SOLUTION_TYPE' | 'QUALIFICATION';
export type TagStatusType = 'DRAFT' | 'VALID';

export interface TagEntry {
  originalLabel?: string;
  lang: string;
  label: string;
  description: string;
}

// TODO remove multiling
export interface Tag {
  _id?: string;
  originalTagId?: string;
  readonly type?: TagType;
  readonly attachments?: Array<TagAttachment>;
  readonly status?: TagStatusType;
  readonly created?: Date;
  readonly updated?: Date;
  count?: number;
  entry?: Array<TagEntry>;

  /**
   * TODO remove these because will be replaced with entry
   */
   readonly originalLabel?: UmiusMultilingInterface;
   label?: UmiusMultilingInterface;
   description?: UmiusMultilingInterface;
}
