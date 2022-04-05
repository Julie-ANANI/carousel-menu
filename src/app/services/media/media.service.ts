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

  public update(mediaId: string, media: UmiusMediaInterface): Observable<any> {
    console.log('sent media', media);
    const uri = `/media/${mediaId}`;
    return this._http.put<any>(uri, media);
  }

}
