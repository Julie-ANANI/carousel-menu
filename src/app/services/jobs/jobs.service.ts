import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class JobsService {

  constructor(private _http: HttpClient) {
  }

  public getAllCategoriesAndJobs(config: { [header: string]: string | string[] }): Observable<any> {
    return this._http.get<any>('/jobs/categories', {params: config});
  }

  public getAllSeniorityLevels(config: { [header: string]: string | string[] }): Observable<any> {
    return this._http.get<any>('/jobs/seniorityLevels', {params: config});
  }

}
