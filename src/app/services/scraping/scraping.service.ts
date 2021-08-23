import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ScrapingService {

  constructor(private _http: HttpClient) {
  }

  public getScraping(params: any): Observable<any> {
    return this._http.post('/scraping/getScraping', params);
  }

  public checkScraping(params: any): Observable<any> {
    return this._http.post('/scraping/checkScraping', params);
  }

  public cancelScraping(params: any): Observable<any> {
    return this._http.post('/scraping/cancelScraping', params);
  }

  public scrapePdf(file: File): Observable<any> {
    const formData = new FormData();
    const fileName = 'Recherche de mails';
    formData.append('file', file, fileName);
    return this._http.post('/scraping/scrapePdf', formData);
  }
}
