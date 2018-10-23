import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class EmailService {

  constructor(private _http: HttpClient) { }

  public stopBatch(batchId: string): Observable<any> {
    return this._http.post( '/mail/queue/' + batchId, {newStatus: 'CANCELED'} );
  }

  public getBatch(batchId: string): Observable<any> {
    return this._http.get( '/mail/queue/' + batchId );
  }

  public getQueue(params: any): Observable<any> {
    return this._http.get('/mail/queue', {params: params});
  }

  public getBlacklist(config: any): Observable<any> {
      return this._http.get('/mail/blacklist', {params: config});
  }

  public addToBlacklist(config: any): Observable<any> {
      return this._http.post('/mail/blacklist', config);
  }

  public updateBlacklistEntry(entryId: string, data: any): Observable<any> {
      return this._http.put('/mail/blacklist/' + entryId, data);
  }

  public getCountries(config: any): Observable<any> {
    return this._http.get('/mail/filteredCountries', {params: config});
  }

  public addCountry(config: any): Observable<any> {
    return this._http.post('/mail/filteredCountries', config);
  }

  public updateCountry(entryId: string, data: any): Observable<any> {
    return this._http.put('/mail/filteredCountries/' + entryId, data);
  }

  public deleteCountry(countryId: any): Observable<any> {
    return this._http.delete('/mail/filteredCountries/' + countryId);
  }

}
