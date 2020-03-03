import { Component } from '@angular/core';

@Component({
  selector: 'sidebar',
  styleUrls: ['../../docs-css.component.scss'],
  templateUrl: './sidebar.component.html'
})

export class SidebarComponent {

  toggleSidebar: boolean = false;

  rightSidebar: boolean = false;

  constructor() {
  }

}

