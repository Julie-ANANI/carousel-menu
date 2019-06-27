import { Component } from '@angular/core';
import {Config} from '../../../../../models/config';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-admin-pros',
  templateUrl: './admin-professionals.component.html',
  styleUrls: ['./admin-professionals.component.scss']
})

export class AdminProfessionalsComponent {

  private _config: Config = {
    fields: 'language firstName lastName company country jobTitle campaigns tags messages ambassador.is',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _fetchingError: boolean;

  constructor(private _activatedRoute: ActivatedRoute,) {

    if (this._activatedRoute.snapshot.data.professionals && Array.isArray(this._activatedRoute.snapshot.data.professionals.result)) {

    } else {
      this._fetchingError = true;
    }

  }

  get config(): Config {
    return this._config;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

}
