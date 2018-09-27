import { Injectable } from '@angular/core';
import { Http, Response } from '../http.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class EmailService {

  constructor(private _http: Http) { }

  public stopBatch(batchId: string): Observable<any> {
    return this._http.post( '/mail/queue/' + batchId, {newStatus: 'CANCELED'} )
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getBatch(batchId: string): Observable<any> {
    return this._http.get( '/mail/queue/' + batchId )
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getQueue(params: any): Observable<any> {
    return this._http.get('/mail/queue', {params: params})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getBlacklist(config: any): Observable<any> {
      return this._http.get('/mail/blacklist', {params: config})
        .pipe(
          map((res: Response) => res.json()),
          catchError((error: Response) => throwError(error.text()))
        );
  }

  public addToBlacklist(config: any): Observable<any> {
      return this._http.post('/mail/blacklist', config)
        .pipe(
          map((res: Response) => res.json()),
          catchError((error: Response) => throwError(error.text()))
        );
  }

  public updateBlacklistEntry(entryId: string, data: any): Observable<any> {
      return this._http.put('/mail/blacklist/' + entryId, data)
        .pipe(
          map((res: Response) => res.json()),
          catchError((error: Response) => throwError(error.text()))
        );
  }

  public getCountries(config: any): Observable<any> {
    return this._http.get('/mail/filteredCountries', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public addCountry(config: any): Observable<any> {
    return this._http.post('/mail/filteredCountries', config)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public updateCountry(entryId: string, data: any): Observable<any> {
    return this._http.put('/mail/filteredCountries/' + entryId, data)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public deleteCountry(countryId: any): Observable<any> {
    return this._http.delete('/mail/filteredCountries/' + countryId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getRawMessages(config: any): Observable<any> {
      return this._http.get('/mail/blacklist', {params: config})
        .pipe(
          map((res: Response) => res.json()),
          catchError((error: Response) => throwError(error.text()))
        );
  }

}
