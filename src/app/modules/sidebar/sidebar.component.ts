import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Template } from './interfaces/template';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('animateWrapper', [
      state('inactive', style({
        display: 'none',
        opacity: 0,
        background: 'none'
      })),
      state('active', style({
        display: 'block',
        opacity: 1,
        background: 'rgba(0,0,0,0.5)'
      })),
      transition('inactive => active', animate('.5ms ease-in-out')),
      transition('active => inactive', animate('700.5ms ease-in-out'))
    ]),
    trigger('animateContent', [
      state('inactive', style({
        transform: 'translateX(100%)'
      })),
      state('active', style({
        transform: 'translateX(0)'
      })),
      transition('inactive <=> active', animate('700ms ease-in-out'))
    ])
  ]
})

export class SidebarComponent implements OnInit {

  @Input() set template(value: Template) {
    this.setTemplate(value);
  };

  @Output() closeSidebar = new EventEmitter<string>();

  title: string; // Sidebar heading
  state: string; // Animation state
  size: string; // Sidebar size

  constructor() {  }

  ngOnInit(): void {
    this.state = 'inactive';
  }

  setTemplate(value: Template) {
    this.state = value.animate_state;
    this.title = value.title;
    this.size = value.size;
  }

  toggleState(event: Event, target: any) {
    if (event.target['id'] === 'sidebar-wrapper' || event.target['id'] === 'close') {
      this.state = 'inactive';
      this.closeSidebar.emit(this.state);
      setTimeout(() => {
        target.scrollIntoView();
      }, 500);
    }
  }

}

