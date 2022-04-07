import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = '/authorized/access/scraping';

@Injectable({providedIn: 'root'})
export class ScrapingService {

  constructor(private _http: HttpClient) {
  }

  public getScraping(params: any): Observable<any> {
    return this._http.post(baseUrl + '/getScraping', params);
  }

  public checkScraping(params: any): Observable<any> {
    return this._http.post(baseUrl + '/checkScraping', params);
  }

  public cancelScraping(params: any): Observable<any> {
    return this._http.post(baseUrl + '/cancelScraping', params);
  }

  public getRunningScrapings(): Observable<any> {
    return this._http.get(baseUrl + '/runningScrapings');
  }

  public scrapePdf(file: File): Observable<any> {
    const formData = new FormData();
    const fileName = 'Recherche de mails';
    formData.append('file', file, fileName);
    return this._http.post(baseUrl + '/scrapePdf', formData);
  }
}
