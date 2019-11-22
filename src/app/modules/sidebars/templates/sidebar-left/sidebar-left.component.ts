import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarInterface } from '../../interfaces/sidebar-interface';

@Component({
  selector: 'sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss']
})

export class SidebarLeftComponent {

  @Input() set sidebarTemplate(value: SidebarInterface) {
    this._sidebarTemplate = {
      size: value.size || '263px',
      animate_state: value.animate_state || 'inactive',
      type: value.type || ''
    };
  }

  @Output() sidebarTemplateChange: EventEmitter<SidebarInterface> = new EventEmitter<SidebarInterface>();

  private _sidebarTemplate: SidebarInterface = {
    animate_state: 'inactive',
    size: '263px',
  };

  constructor() { }

  public toggleState(event: Event, target: any) {
    event.preventDefault();

    setTimeout(() => {
      target.scrollIntoView();
    }, 300);

    this._sidebarTemplate.animate_state = this._sidebarTemplate.animate_state === 'inactive' ? 'active' : 'inactive';

    this.sidebarTemplateChange.emit({
      animate_state: this._sidebarTemplate.animate_state,
      size: this._sidebarTemplate.size,
      type: this._sidebarTemplate.type
    });

  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

}
