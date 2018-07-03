import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {Collaborator} from '../../interfaces/collaborator';

@Component({
  selector: 'app-sidebar-collaborator',
  templateUrl: './sidebar-collaborator.component.html',
  styleUrls: ['./sidebar-collaborator.component.scss'],
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

export class SidebarCollaboratorComponent implements OnInit {

  @Input() animate_state: string;

  @Input() set collaborator(value: Collaborator) {
    this.loadCollaborator(value);
  }

  @Output() closeSidebar = new EventEmitter<string>();

  addedLength = 0;
  invitedLength = 0;

  constructor() { }

  ngOnInit() {
    this.animate_state = 'inactive';
  }

  loadCollaborator(value: Collaborator) {
    this.addedLength = value.addedLength;
    this.invitedLength = value.invitedLength;
  }

  toggleState() {
    this.animate_state = 'inactive';
    this.closeSidebar.emit(this.animate_state);
  }

}
