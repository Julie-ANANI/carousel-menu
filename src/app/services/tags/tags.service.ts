import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { Tag } from './../../models/tag';

@Injectable()
export class TagsService {

  constructor(private _http: Http) {
  }

  public create(tagObj: Tag): Observable<Tag> {
    return this._http.post('/tags/entity', tagObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<any> {
    return this._http.get('/tags/entity/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(config: any): Observable<{result: Array<Tag>, _metadata: any}> {
    return this._http.get('/tags/entity', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAttachments(type: string): Observable<{result: Array<any>, _metadata: any}> {
    return this._http.get('/tags/attachments' + (type ? '?type=' + type : ''))
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(tagId: string): Observable<any> {
    return this._http.delete('/tags/entity/' + tagId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public save(tagId: string, tagObj: Tag): Observable<Tag> {
    return this._http.put('/tags/entity/' + tagId, tagObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  /*
   * Pools routes
   */

  public getTagsFromPool(innovationId: string): Observable<Array<Tag>> {
    return this._http.get('/tags/' + innovationId + '/pool')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public searchTagInPool(innovationId: string, keyword: string): Observable<Array<Tag>> {
    return this._http.get('/tags/' + innovationId + '/pool/search', { params: {keyword: keyword }})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public addTagToPool(innovationId: string, tagId: string): Observable<Array<Tag>> {
    return this._http.post('/tags/' + innovationId + '/pool', { params: {tag: tagId }})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public updateTagInPool(innovationId: string, tag: Tag): Observable<Array<Tag>> {
    return this._http.put('/tags/' + innovationId + '/pool', { params: tag})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public removeTagFromPool(innovationId: string, tagId: string): Observable<Array<Tag>> {
    return this._http.delete('/tags/' + innovationId + '/pool', { params: {tag: tagId }})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

}
