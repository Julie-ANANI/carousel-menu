import { CompozerComponent } from './compozer-component';

export class TextboxCompozerComponent extends CompozerComponent<string> {
  public compozerType = 'question';
  public type: string;

  constructor(options: {}) {
    super(options);
    this.type = options['type'] || 'textbox';
  }
}
