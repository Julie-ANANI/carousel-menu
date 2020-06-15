import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SidebarInterface} from '../../interfaces/sidebar-interface';

/***
 * used this when you want to show the sidebar in the page itself.
 * Provide the size in the number like '265' not '265px or 50%'.
 * You also have to specify the size of the wrapper container.
 * By default the sidebar size is 265 so the outside container
 * size is 297. To calc just add the 32 to size the of the sidebar.
 *
 * Example: shared market report component.
 */

@Component({
  selector: 'app-sidebar-in-page',
  templateUrl: './sidebar-in-page.component.html',
  styleUrls: ['./sidebar-in-page.component.scss']
})

export class SidebarInPageComponent {

  @Input() set sidebarTemplate(value: SidebarInterface) {
    this._sidebarTemplate = {
      size: value.size ? (Number(value.size) - 32).toString(10) : '265',
      animate_state: value.animate_state || 'inactive',
      type: value.type || ''
    };
  }

  @Input() position = 'sticky';

  @Output() sidebarTemplateChange: EventEmitter<SidebarInterface> = new EventEmitter<SidebarInterface>();

  private _sidebarTemplate: SidebarInterface = <SidebarInterface>{};

  constructor() {}

  public toggleState(event: Event) {
    event.preventDefault();
    this._sidebarTemplate.animate_state = this._sidebarTemplate.animate_state === 'inactive' ? 'active' : 'inactive';
    this._emit();
  }

  private _emit() {
    this.sidebarTemplateChange.emit(this._sidebarTemplate);
  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

}
