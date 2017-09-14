/**
 * Created by juandavidcruzgomez on 08/09/2017.
 */
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';

@Injectable()
export class EnvironmentService{
  private _env: any;

  constructor() {
    this._env = environment;
  }

  public getDomain(): string {
    return this._env.domain;
  }

  public getAPIUrl(): string {
    return this._env.apiUrl;
  }

  public getCompanyName(): string {
    return this._env.companyName;
  }

  public isInProduction(): boolean {
    return !!(this._env.production);
  }
}

