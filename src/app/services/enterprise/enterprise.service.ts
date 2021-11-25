import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enterprise } from '../../models/enterprise';
import { Config } from '@umius/umi-common-component/models';

@Injectable({providedIn: 'root'})
export class EnterpriseService {
  public _queryConfig: Config = <Config>{};
  public _enterprisesSelected: Array<any> = [];

  constructor(private _http: HttpClient) {
  }

  public setQueryConfig(value: Config) {
    this._queryConfig = value;
  }

  public setEnterprisesSelected(value: any) {
    this._enterprisesSelected = value;
  }


  public create(enterprise: Enterprise): Observable<Enterprise> {
    return this._http.post<Enterprise>(`/enterprise/`, enterprise);
  }

  public all(config?: { [header: string]: string | string[] }): Observable<any> {
    return this._http.get(`/enterprise/all`, {params: config});
  }

  public get(id?: string, config?: { [header: string]: string | string[] }): Observable<any> {
    return this._http.get(`/enterprise/${id ? id : ''}`, {params: config});
  }

  public save(enterpriseId: string, enterprise: Enterprise, enterpriseBeforeUpdateDataForm?: any): Observable<Enterprise> {
    return this._http.put<Enterprise>(`/enterprise/${enterpriseId}`, {enterprise: enterprise, before: enterpriseBeforeUpdateDataForm});
  }

  public updateLogo(enterpriseId: string, logo: any): Observable<Enterprise> {
    return this._http.post<Enterprise>(`/enterprise/${enterpriseId}/updateLogo`, {logo: logo});
  }

  public remove(enterpriseId: string): Observable<any> {
    return this._http.delete(`/enterprise/${enterpriseId}`);
  }
}
