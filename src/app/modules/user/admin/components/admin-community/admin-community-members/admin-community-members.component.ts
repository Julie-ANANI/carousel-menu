import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-community-members',
  templateUrl: './admin-community-members.component.html',
  styleUrls: ['./admin-community-members.component.scss']
})

export class AdminCommunityMembersComponent implements OnInit {

  private _config: any;

  private _startSearch: boolean = false;

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

  public onSearchClick(event) {
    console.log(`Search! ${event}`);
    this._startSearch = true;
  }

  public launchSearch() {
    console.log("GO GO GO!");
  }

  get startSearch(): boolean {
    return this._startSearch;
  }

  set startSearch(value: boolean) {
    this._startSearch = value;
  }

}