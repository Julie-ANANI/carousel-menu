export interface Choice {
  readonly _name: string | number;
  readonly _alias?: string;
  readonly _class?: labelClass | any;
  readonly _disabledClass?: labelClass;
  readonly _url?: string;
}

export type labelClass = 'label is-progress' | 'label is-success' | 'label is-danger' | 'label is-secondary'
  | 'label is-draft' | 'button is-danger' | 'button is-secondary' | 'button is-draft' | 'text-secondary'
  | 'text-draft' | 'text-alert' | 'label is-info' | '';
