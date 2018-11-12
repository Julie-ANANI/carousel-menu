import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-pros',
  templateUrl: './admin-professionals.component.html',
  styleUrls: ['./admin-professionals.component.scss']
})

export class AdminProfessionalsComponent implements OnInit {

  private _config: any;

  constructor() { }
  // These are the asked fields for the professional list. We don't use all of that...
  //fields: 'language firstName lastName company email emailConfidence country jobTitle campaigns tags messages',
  ngOnInit() {
    this._config = {
      fields: 'language firstName lastName company country jobTitle campaigns tags messages',
      limit: 10,
      offset: 0,
      search: {},
      sort: {
        created: -1
      }
    };
  }

  set config(value: any) {
    this._config = value;
  }

  get config() {
    return this._config;
  }

}
