import { Component, OnInit } from '@angular/core';
import { SidebarInterface } from "../../../../../sidebar/interfaces/sidebar-interface";

@Component({
  selector: 'app-admin-community-members',
  templateUrl: './admin-community-members.component.html',
  styleUrls: ['./admin-community-members.component.scss']
})

export class AdminCommunityMembersComponent implements OnInit {

  private _config: any;

  private _sidebarValue: SidebarInterface = {};

  ngOnInit() {
    this._config = {
      fields: 'language firstName lastName company country jobTitle campaigns tags messages',
      limit: '10',
      offset: '0',
      search: '{"ambassador.is":true}',
      sort: '{"created":-1}'
    };
  }

  get config() {
    return this._config;
  }

  public launchSearch(event: Event) {
    console.log("GO GO GO!");
    console.log(event);
  }

  public onSearchClick(event: Event) {
    event.preventDefault();
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'Smart search',
      type: 'professional'
    };
    //title: 'COMMON.EDIT_PROFESSIONAL',
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }
}
