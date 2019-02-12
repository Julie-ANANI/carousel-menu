import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-admin-community-search',
  templateUrl: './admin-community-search.component.html',
  styleUrls: ['./admin-community-search.component.scss']
})

//FormsModule

export class AdminCommunitySearchComponent implements OnInit {

  private _config: any;

  constructor() {
  }

  ngOnInit() {
    this._config = {
      fields: 'language firstName lastName company country jobTitle campaigns tags messages',
      limit: '10',
      offset: '0',
      search: '{"ambassador.is":true}',
      sort: '{"created":-1}'
    };
    console.log(this._config);
  }

}