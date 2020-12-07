import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-shared-toggle-list',
  templateUrl: './shared-toggle-list.component.html',
  styleUrls: ['./shared-toggle-list.component.scss']
})
export class SharedToggleListComponent implements OnInit {

  public isToggled = false;

  constructor() {
  }

  ngOnInit() {
  }

  toggle() {
    this.isToggled = !this.isToggled;
  }

}
