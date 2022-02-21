import { Component } from '@angular/core';
import {UmiusConfigInterface} from '@umius/umi-common-component';

@Component({
  selector: 'app-admin-community-members',
  templateUrl: './admin-community-responses.component.html',
  styleUrls: ['./admin-community-responses.component.scss']
})

export class AdminCommunityResponsesComponent {

  private _config: UmiusConfigInterface = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{"status":"REJECTED_GMAIL"}',
    sort: '{"created":-1}'
  };

  get config(): UmiusConfigInterface {
    return this._config;
  }

}
