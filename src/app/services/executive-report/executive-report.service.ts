import { Injectable } from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExecutiveReport } from '../../models/executive-report';

@Injectable({ providedIn: 'root' })
export class ExecutiveReportService {

  constructor(private _http: HttpClient) { }

  public create(lang: string, innovationId: string): Observable<ExecutiveReport> {
    return this._http.post<ExecutiveReport>('/exereport', { lang: lang, innovationId: innovationId});
  }

  public get(executiveReportId: string): Observable<ExecutiveReport> {
    return this._http.get<ExecutiveReport>(`/exereport/${executiveReportId}`);
  }

  public save(executiveReportObj: ExecutiveReport): Observable<ExecutiveReport> {
    return this._http.put<ExecutiveReport>(`/exereport/${executiveReportObj._id}`, executiveReportObj);
  }

  public delete(executiveReportId: string): Observable<ExecutiveReport> {
    return this._http.delete<ExecutiveReport>(`/exereport/${executiveReportId}`);
  }

  public audio(text: string, lang: string): Observable<any> {
    return this._http.post<any>(`/exereport/audio/${lang}`, {text: text});
  }

}
