export interface Choice {
  readonly _name: string;
  readonly _alias?: string;
  readonly _class?: labelClass;
  readonly _url?: string;
}

export type labelClass = 'label-progress' | 'label-validate' | 'label-alert' | 'label-editing' | 'label-draft' | '';
