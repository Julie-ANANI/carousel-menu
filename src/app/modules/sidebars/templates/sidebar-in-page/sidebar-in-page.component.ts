import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SidebarInterface} from '../../interfaces/sidebar-interface';

@Component({
  selector: 'app-sidebar-in-page',
  templateUrl: './sidebar-in-page.component.html',
  styleUrls: ['./sidebar-in-page.component.scss']
})

export class SidebarInPageComponent {

  @Input() set sidebarTemplate(value: SidebarInterface) {
    this._sidebarTemplate = {
      size: value.size || '265',
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
