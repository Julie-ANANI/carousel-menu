import { CompozerComponent,
         TextboxCompozerComponent,
         DropdownCompozerComponent,
         CheckboxCompozerComponent,
         ContentCompozerComponent } from './compozer';

export class CompozerRow {
  public components: CompozerComponent<any>[] = [];

  constructor(components?: CompozerComponent<any>[]) {
    for (let component of components) {
      switch (component.questionType) {
        case 'textbox' || 'textarea':
          component = new TextboxCompozerComponent(component);
          break;
        case 'checkbox':
          component = new CheckboxCompozerComponent(component);
          break;
        case 'dropdown':
          component = new DropdownCompozerComponent(component);
          break;
        case 'content':
          component = new ContentCompozerComponent(component);
          break;
      }
      this.components.push(component);
    }

    this.components.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

}
