import { CompozerComponent } from './compozer-component';

export class CheckboxCompozerComponent extends CompozerComponent<string> {
  public controlType = 'checkbox';
  public type: string;
  public checked: boolean;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || 'checkbox';
    this.checked = options['checked'] || false;
  }
}
