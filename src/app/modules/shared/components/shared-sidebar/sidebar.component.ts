import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Template } from './interfaces/template';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
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

  toggleState() {
    this.state = 'inactive';
    this.closeSidebar.emit(this.state);
  }

}

