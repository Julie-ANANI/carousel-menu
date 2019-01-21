import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-pros',
  templateUrl: './admin-professionals.component.html',
  styleUrls: ['./admin-professionals.component.scss']
})

export class AdminProfessionalsComponent implements OnInit {

  private _config: any;

  ngOnInit() {
    this._config = {
      fields: 'language firstName lastName company country jobTitle campaigns tags messages',
      limit: '10',
      offset: '0',
      search: '{}',
      sort: '{"created":-1}'
    };
  }

  get config() {
    return this._config;
  }

}
