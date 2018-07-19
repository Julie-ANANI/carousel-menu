import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Template} from '../../../sidebar/interfaces/template';


@Component({
  selector: 'app-admin-country-management',
  templateUrl: './admin-country-management.component.html',
  styleUrls: ['./admin-country-management.component.scss']
})
export class AdminCountryManagementComponent implements OnInit {

  private _more: Template = {};
  sidebarState = new Subject<string>();

  constructor() { }

  ngOnInit(): void {

  }

  filterCountry() {
    this._more = {
      animate_state: 'active',
      title: 'COMMON.EXCLUDE-COUNTRIES',
      type: 'excludeCountry'
    };
  }

  closeSidebar(value: string) {
    this.more.animate_state = value;
    this.sidebarState.next(this.more.animate_state);
  }

  get more(): Template { return this._more; }
}
