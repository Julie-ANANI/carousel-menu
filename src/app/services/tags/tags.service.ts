import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { Tag } from './../../models/tag';

@Injectable()
export class TagsService {

  constructor(private _http: Http) {
  }

  public create(tagObj: Tag): Observable<Tag> {
    return this._http.post('/tags', tagObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<Tag> {
    return this._http.get('/tags/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(config: any): Observable<{result: Array<Tag>, _metadata: any}> {
    return this._http.get('/tags/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(tagId: string): Observable<any> {
    return this._http.delete('/tags/' + tagId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public save(tagId: string, tagObj: Tag): Observable<Tag> {
    return this._http.put('/tags/' + tagId, tagObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

}
