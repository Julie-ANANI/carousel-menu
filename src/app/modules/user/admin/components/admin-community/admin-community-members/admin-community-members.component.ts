import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { SidebarInterface } from "../../../../../sidebar/interfaces/sidebar-interface";

@Component({
  selector: 'app-admin-community-members',
  templateUrl: './admin-community-members.component.html',
  styleUrls: ['./admin-community-members.component.scss']
})

export class AdminCommunityMembersComponent implements OnInit {

  private _config: any;

  private _sidebarValue: SidebarInterface = {};

  private _searchResult: any;

  @Output() forceParentReload = new EventEmitter <any>();

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

  public receiveResult(event: Event) {
    if(event['result'] && event['result'].length) {
      this._searchResult = event['result'];
      console.log(this._searchResult);
    } else {
      this._searchResult = [];
    }
  }

  public onFinishUpload(event: Event) {
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active'
    };
  }

  public onSearchClick(event: Event) {
    event.preventDefault();
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      size: null,
      title: 'Smart search',
      type: 'professional'
    };
  }

  public onAddAmbassadors(event: Event) {
    event.preventDefault();
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      size: "60%",
      title: 'Add ambassadors',
      type: 'professional'
    };
  }

  public onImportAmbassadors(event: Event) {
    event.preventDefault();
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      size: "60%",
      title: 'Import ambassadors'
    };
  }

  get searchResult(): any {
    return this._searchResult;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }
}
