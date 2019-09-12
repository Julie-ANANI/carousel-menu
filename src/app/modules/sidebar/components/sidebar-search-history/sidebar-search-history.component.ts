import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar-search-history',
  templateUrl: './sidebar-search-history.component.html',
  styleUrls: ['./sidebar-search-history.component.scss']
})
export class SidebarSearchHistoryComponent {

  @Output() paramsChange = new EventEmitter <any>();
  @Output() close = new EventEmitter <any>();
  @Input() request: any;

  constructor() {}



}

