import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SidebarInterface } from './interfaces/sidebar-interface';

@Component({
  selector: 'app-sidebar',
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
      transition('inactive => active', animate('400ms ease-in')),
      transition('active => inactive', animate('700ms ease-out')),
    ]),

    trigger(('animateSidebarBackdrop'), [
      state('inactive', style({
        display: 'none',
        opacity: 0,
        background: 'none'
      })),
      state('active', style({
        display: 'block',
        opacity: 1,
        background: 'rgba(0,0,0,0.75)',
      })),
      transition('inactive => active', animate('.5ms ease-in-out')),
      transition('active => inactive', animate('700ms ease-in-out')),
    ])

  ]
})

export class SidebarComponent implements OnInit {

  @Input() set template(value: SidebarInterface) {
    this.setTemplate(value);
  }

  @Output() templateChange: EventEmitter<SidebarInterface> = new EventEmitter<SidebarInterface>();

  @Output() closeSidebar = new EventEmitter<SidebarInterface>(); // todo: remove this line

  private _title: string; // heading
  private _state: string; // animation state
  private _size: string; // size
  private _type: string; // type

  constructor() {}

  ngOnInit(): void {
    this._state = 'inactive';
  }


  /***
   * This function is used to initialize the received value to the sidebar variables.
   * @param {SidebarInterface} value
   */
  private setTemplate(value: SidebarInterface) {
    this._type = value.type;
    this._state = value.animate_state === undefined ? 'inactive' : value.animate_state ;
    this._title = value.title;
    this._size = value.size;
  }


  /***
   * This function is to toggle the sidebar state and also to move up the scroll.
   * @param {Event} event
   * @param target
   */
  toggleState(event: Event, target: any) {
    if (event.target['id'] === 'sidebar-wrapper' || event.target['id'] === 'close') {
      this._state = 'inactive'; // todo: remove this line
      this.templateChange.emit({animate_state: 'inactive', title: this._title, type: this._type});
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

