import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EmailService {

  constructor(private _http: Http) { }

  public stopBatch(batchId: string): Observable<any> {
    return this._http.post( '/mail/queue/' + batchId, {newStatus: 'CANCELED'} )
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getBatch(batchId: string): Observable<any> {
    return this._http.get( '/mail/queue/' + batchId )
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getQueue(params: any): Observable<any> {
    return this._http.get('/mail/queue', {params: params})
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getBlacklist(config: any): Observable<any> {
      return this._http.get('/mail/blacklist', {params: config})
          .map((res: Response) => {
              const response = res.json();
              return response;
          })
          .catch((error: Response) => Observable.throw(error.json()));
  }

  public addToBlacklist(config: any): Observable<any> {
      return this._http.post('/mail/blacklist', config)
          .map((res: Response) => {
              const response = res.json();
              return response;
          })
          .catch((error: Response) => Observable.throw(error.json()));
  }

  public updateBlacklistEntry(entryId: string, data: any): Observable<any> {
      return this._http.put('/mail/blacklist/' + entryId, data)
          .map((res: Response) => {
              const response = res.json();
              return response;
          })
          .catch((error: Response) => Observable.throw(error.json()));
  }

  public getCountries(config: any): Observable<any> {
    return this._http.get('/mail/filteredCountries', {params: config})
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public addCountry(config: any): Observable<any> {
    return this._http.post('/mail/filteredCountries', config)
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public updateCountry(entryId: string, data: any): Observable<any> {
    return this._http.put('/mail/filteredCountries/' + entryId, data)
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public deleteCountry(countryId: any): Observable<any> {
    return this._http.delete('/mail/filteredCountries/' + countryId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getRawMessages(config: any): Observable<any> {
      return this._http.get('/mail/blacklist', {params: config})
          .map((res: Response) => {
              const response = res.json();
              return response;
          })
          .catch((error: Response) => Observable.throw(error.json()));
  }


}
