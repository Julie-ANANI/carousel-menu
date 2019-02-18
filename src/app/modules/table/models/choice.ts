export interface Choice {
  readonly _name: string;
  readonly _alias?: string;
  readonly _class?: labelClass;
  readonly _url?: string;
}

export type labelClass = 'label label-progress' | 'label label-success' | 'label label-alert' | 'label label-editing' | 'label label-draft' | '';
