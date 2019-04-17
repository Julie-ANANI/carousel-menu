import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar-search-tool',
  templateUrl: './sidebar-search-tool.component.html',
  styleUrls: ['./sidebar-search-tool.component.scss']
})
export class SidebarSearchToolComponent {

  @Output() paramsChange = new EventEmitter <any>();
  @Output() close = new EventEmitter <any>();
  @Input() params: any;

  constructor() {}
}

