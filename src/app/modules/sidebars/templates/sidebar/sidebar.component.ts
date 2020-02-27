import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SidebarInterface } from '../../interfaces/sidebar-interface';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [

    trigger(('animateSidebar'), [
      state('inactive', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      state('active', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('inactive <=> active', animate('250ms ease-in-out')),
    ]),

  ]
})

export class SidebarComponent {

  @Input() set template(value: SidebarInterface) {
    this._type = value.type;
    this._state = value.animate_state === undefined ? 'inactive' : value.animate_state ;
    this._title = value.title;
    this._size = value.size;
  }

  @Output() templateChange: EventEmitter<SidebarInterface> = new EventEmitter<SidebarInterface>();

  @Output() closeSidebar = new EventEmitter<SidebarInterface>(); // todo: remove this line

  private _title: string;

  private _state = 'inactive';

  private _size = '452px';

  private _type: string;

  constructor() {}

  /***
   * This function is to toggle the sidebar state and also to move up the scroll.
   * @param {Event} event
   * @param target
   */
  public toggleState(event: Event, target: any) {
    if ((event.target as HTMLElement).id === 'close') {
      this._state = 'inactive'; // todo: remove this line
      this.templateChange.emit({ animate_state: 'inactive', title: this._title, type: this._type });
      this.closeSidebar.emit({animate_state: this._state, title: this._title, type: this._type}); // todo: remove this line
      setTimeout(() => {
        target.scrollIntoView();
      }, 300);
    }
  }

  get title(): string {
    return this._title;
  }

  get state(): string {
    return this._state;
  }

  get size(): string {
    return this._size;
  }

  set size(value: string) {
    this._size = value;
  }

  get type(): string {
    return this._type;
  }

}

