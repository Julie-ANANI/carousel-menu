import { CompozerComponent } from './compozer-component';

export class ContentCompozerComponent extends CompozerComponent<string> {
  public compozerType = 'content';

  constructor(options: {} = {}) {
    super(options);
  }
}
