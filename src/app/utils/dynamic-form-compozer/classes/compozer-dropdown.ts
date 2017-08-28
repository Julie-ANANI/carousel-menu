import { CompozerComponent } from './compozer-component';

export class DropdownCompozerComponent extends CompozerComponent<string> {
  public compozerType = 'question';
  public questionType = 'dropdown';
  public options: {key: string, value: string, disabled?: boolean}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
