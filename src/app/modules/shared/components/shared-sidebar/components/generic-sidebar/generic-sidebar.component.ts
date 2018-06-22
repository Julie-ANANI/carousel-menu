import {Component, Input} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {GenericSidebar} from '../../interfaces/generic-sidebar';

@Component({
  selector: 'app-generic-sidebar',
  templateUrl: './generic-sidebar.component.html',
  styleUrls: ['./generic-sidebar.component.scss'],
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
      transition('inactive => active', animate('700ms ease-in-out'))
    ])
  ]
})

export class GenericSidebarComponent {

  @Input() set data(value: GenericSidebar) {
    this.loadData(value);
  };

  private _title: string; // Sidebar heading
  private _state: string; // animation state
  private _content: string;

  constructor() {
  }

  loadData(value: GenericSidebar) {
    this._content = value._content;
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

  get content(): string {
    return this._content;
  }

  toggleState() {
    this._state = 'inactive';
  }
}

