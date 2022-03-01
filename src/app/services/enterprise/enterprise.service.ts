import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UmiusConfigInterface, UmiusEnterpriseInterface} from '@umius/umi-common-component';

@Injectable({providedIn: 'root'})
export class EnterpriseService {
  public _queryConfig: UmiusConfigInterface = <UmiusConfigInterface>{};
  public _enterprisesSelected: Array<any> = [];

  constructor(private _http: HttpClient) {
  }

  public setQueryConfig(value: UmiusConfigInterface) {
    this._queryConfig = value;
  }

  public setEnterprisesSelected(value: any) {
    this._enterprisesSelected = value;
  }


  public create(enterprise: UmiusEnterpriseInterface): Observable<UmiusEnterpriseInterface> {
    return this._http.post<UmiusEnterpriseInterface>(`/enterprise/`, enterprise);
  }

  public all(config?: { [header: string]: string | string[] }): Observable<any> {
    return this._http.get(`/enterprise/all`, {params: config});
  }

  public get(id?: string, config?: { [header: string]: string | string[] }): Observable<any> {
    return this._http.get(`/enterprise/${id ? id : ''}`, {params: config});
  }

  public save(enterpriseId: string, enterprise: UmiusEnterpriseInterface, enterpriseBeforeUpdateDataForm?: any): Observable<UmiusEnterpriseInterface> {
    return this._http.put<UmiusEnterpriseInterface>(`/enterprise/${enterpriseId}`, {enterprise: enterprise, before: enterpriseBeforeUpdateDataForm});
  }

  public updateLogo(enterpriseId: string, logo: any): Observable<UmiusEnterpriseInterface> {
    return this._http.post<UmiusEnterpriseInterface>(`/enterprise/${enterpriseId}/updateLogo`, {logo: logo});
  }

  public remove(enterpriseId: string): Observable<any> {
    return this._http.delete(`/enterprise/${enterpriseId}`);
  }
}
