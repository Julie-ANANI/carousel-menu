import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UmiusMediaInterface} from '@umius/umi-common-component';

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

  public replace(formData: FormData, mediaId: string): Observable<any> {
    const uri = `/media/${mediaId}/replace`;
    return this._http.put<any>(uri, formData);
  }

  public update(mediaId: string, media: UmiusMediaInterface): Observable<any> {
    const uri = `/media/${mediaId}/update`;
    return this._http.put<any>(uri, media);
  }

}
