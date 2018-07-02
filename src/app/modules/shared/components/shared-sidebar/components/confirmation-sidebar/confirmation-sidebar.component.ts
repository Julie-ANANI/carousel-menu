/*
    This component can be used to ask the client or admin for the confirmation
    of their action like when the client wants to delete their project or
    send the project to the validation. We use sidebar functionality
    instead of modal.
 */

import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-confirmation-sidebar',
  templateUrl: './confirmation-sidebar.component.html',
  styleUrls: ['./confirmation-sidebar.component.scss'],
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

export class ConfirmationSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
