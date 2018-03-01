/**
 * Created by juandavidcruzgomez on 26/07/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { Media } from '../../models/media';

@Injectable()
export class MediaService {

  constructor(private _http: Http) {}

  public create(mediaObj: Media): Observable<Media> {
    return this._http.post('/media/', mediaObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<Media> {
    return this._http.get('/media/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error));
  }

  public sample(): Observable<any> {
    return this._http.get('/sample' );
  }
}
