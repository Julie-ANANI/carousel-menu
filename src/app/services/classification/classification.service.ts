import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SeniorityClassification} from '../../models/SeniorityClassification';
import {JobsClassification} from '../../models/jobs-classification';

@Injectable({providedIn: 'root'})
export class ClassificationService {

  constructor(private _http: HttpClient) {
  }

  public seniorityLevels(params: any): Observable<{ classification: SeniorityClassification }> {
    return this._http.get<{ classification: SeniorityClassification }>('/classification/seniorityLevels', {params: params});
  }

  public categoriesAndJobs(params: any): Observable<{ classification: JobsClassification }> {
    return this._http.get<{ classification: JobsClassification }>('/classification/jobs', {params: params});
  }

  public classificationDates(): Observable<string[]> {
    return this._http.get<string[]>('/classification/dates', {params: {}});
  }

}
