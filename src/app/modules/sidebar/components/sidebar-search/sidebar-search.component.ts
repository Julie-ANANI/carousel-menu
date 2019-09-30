import {Component, EventEmitter, Input, Output} from '@angular/core';
import { GeographySettings } from "../../../../models/innov-settings";

@Component({
  selector: 'app-sidebar-search',
  templateUrl: './sidebar-search.component.html',
  styleUrls: ['./sidebar-search.component.scss']
})
export class SidebarSearchComponent {

  @Output() paramsChange = new EventEmitter <any>();
  @Output() geographyChange = new EventEmitter <any>();
  @Output() close = new EventEmitter <any>();
  @Input() params: any;
  @Input() geography: GeographySettings;


  constructor() {}

  public saveParams(event: any) {
    event.preventDefault();
    event.target.id = "close";
    this.close.emit(event);
    this.paramsChange.emit(this.params);
    this.geographyChange.emit(this.geographyChange);
  }

}

