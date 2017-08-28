import { CompozerComponent } from './compozer-component';

export class HtmlCompozerComponent extends CompozerComponent<string> {
  public compozerType = 'html';

  constructor(options: {} = {}) {
    super(options);
  }
}
