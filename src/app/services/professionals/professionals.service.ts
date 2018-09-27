/**
 * Created by bastien on 19/12/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '../http.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Professional } from '../../models/professional';

@Injectable()
export class ProfessionalsService {

  constructor(private _http: Http) {
  }

  public create(professionalArray: Array<Professional>, campaignId: string, innovationId: string): Observable<any> {
    return this._http.post(`/professional/create/${campaignId}/${innovationId}`, {professionals: professionalArray})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public get(id: string): Observable<any> {
    return this._http.get('/professional/' + id)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAll(config: any): Observable<any> {
    return this._http.get('/professional/', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public remove(professionalId: string): Observable<any> {
    return this._http.delete('/professional/' + professionalId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public save(professionalId: string, professionalObj: Professional): Observable<any> {
    return this._http.put('/professional/' + professionalId, professionalObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public addFromRequest(config: any): Observable<any> {
    return this._http.post(`/professional/addFromRequest/${config.newCampaignId}/${config.newInnovationId}`, config)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public export(config: any): Observable<any> {
    return this._http.post(`/professional/exportCSV`, config)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }
}
