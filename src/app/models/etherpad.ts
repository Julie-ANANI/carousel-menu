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

export type PadType = 'pitch' | 'workflow' | 'synthesis' | 'suggestion' | 'orphan';
