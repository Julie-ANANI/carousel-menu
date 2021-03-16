export interface Etherpad {
  type: PadType;
  elementId: string;
  showChat?: boolean;
  noColors?: boolean;
  lang?: string;
  padID: string;
  groupID?: string;
  innovationId: string;
  userName: string;
  authorID?: string;
}

/**
 * while adding new padType try to make it's length <= 5
 */
export type PadType = 'pitch' | 'workflow' | 'synthesis' | 'suggestion' | 'orphan';
