import { Component, Input } from '@angular/core';
import { SidebarInterface } from '../../interfaces/sidebar-interface';

@Component({
  selector: 'sidebar2',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss']
})

export class SidebarLeftComponent {

  @Input() set sidebarTemplate(value: SidebarInterface) {
    this._sidebarTemplate = {
      size: value.size || '263px'
    }
  }

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

  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

}
