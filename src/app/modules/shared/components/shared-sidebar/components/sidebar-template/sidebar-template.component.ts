import {Component, Input} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {GenericSidebar} from '../../interfaces/generic-sidebar';

@Component({
  selector: 'app-sidebar-template',
  templateUrl: './sidebar-template.component.html',
  styleUrls: ['./sidebar-template.component.scss'],
  animations: [
    trigger('sidebarAnimate', [
      state('inactive', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('inactive <=> active', animate('700ms ease-in-out'))
    ])
  ]
})

export class SidebarTemplateComponent {

  @Input() set data(value: GenericSidebar) {
    this.loadData(value);
  };

  private _title: string; // Sidebar heading
  private _state: string; // animation state

  constructor() {
  }

  loadData(value: GenericSidebar) {
    this._state = value._animate;
    this._title = value._title || 'SideBar';
  }

  set state(value: string) {
    this._state = value;
  }

  get state(): string {
    return this._state;
  }

  set title(value: string) {
    this._title = value;
  }

  get title(): string {
    return this._title;
  }

  toggleState() {
    this._state = 'inactive';
  }

}

