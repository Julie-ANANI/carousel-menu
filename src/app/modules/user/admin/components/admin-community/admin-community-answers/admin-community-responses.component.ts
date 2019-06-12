import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-community-members',
  templateUrl: './admin-community-responses.component.html',
  styleUrls: ['./admin-community-responses.component.scss']
})

export class AdminCommunityResponsesComponent {

  private _config: any = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{"status":"REJECTED_GMAIL"}',
    sort: '{"created":-1}'
  };

  get config() {
    return this._config;
  }

}
