import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar-search-tool',
  templateUrl: './sidebar-search-tool.component.html',
  styleUrls: ['./sidebar-search-tool.component.scss']
})
export class SidebarSearchToolComponent {

  @Output() onSaveRequest = new EventEmitter <any>();
  @Output() close = new EventEmitter <any>();

  constructor() {}

  public saveRequest() {
    this.onSaveRequest.emit();
  }

}

