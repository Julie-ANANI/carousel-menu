import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class MediaService {

  constructor(private _http: HttpClient) { }

  /**
   *
   * @param uri
   * @param formData
   */
  public upload(uri: string, formData: FormData): Observable<any> {
    return this._http.post<any>(uri, formData);
  }

}
