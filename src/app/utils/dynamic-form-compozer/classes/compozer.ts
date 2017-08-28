import { CompozerRow } from './compozer-row';
import { CompozerComponent } from './compozer-component';

export { CompozerRow } from './compozer-row';
export { CompozerComponent } from './compozer-component';
export { ContentCompozerComponent } from './compozer-content';
export { HtmlCompozerComponent } from './compozer-html';
// Inputs
export { DropdownCompozerComponent } from './compozer-dropdown';
export { TextboxCompozerComponent } from './compozer-textbox';
export { CheckboxCompozerComponent } from './compozer-checkbox';

export class Compozer {
  public rows: CompozerRow[] = [];

  constructor(rows?: any[][]) {
    this.updateComponents(rows);
  }

  public getComponent (key: string): any {
    for (const row of this.rows) {
      for (const component of row.components) {
        if (component.key === key) {
          return component;
        }
      }
    }
  }

  public getComponents (): any {
    let components = [];
    for (const row of this.rows) {
      components = components.concat(row.components);
    }
    return components;
  }

  public updateComponents (rows?: any[][]): void {
    if (rows) {
      this.rows = [];
      for (const row of rows) {
        this.rows.push(new CompozerRow(row));
      }
    }
  }

  public addRow (row: any[]): void {
    this.rows.push(new CompozerRow(row));
  }
}
