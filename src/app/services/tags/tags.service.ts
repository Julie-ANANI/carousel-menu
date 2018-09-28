import { Injectable } from '@angular/core';
import { Http } from '../http.service';
import { Observable } from 'rxjs';
import { Tag } from '../../models/tag';

@Injectable()
export class TagsService {

  constructor(private _http: Http) {
  }

  public create(tagObj: Tag): Observable<any> {
    return this._http.post('/tags/entity', tagObj);
  }

  public get(id: string): Observable<any> {
    return this._http.get('/tags/entity/' + id);
  }

  public getAll(config: any): Observable<{result: Array<Tag>, _metadata: any}> {
    return this._http.get('/tags/entity', {params: config});
  }

  public getAttachments(type: string): Observable<{result: Array<any>, _metadata: any}> {
    return this._http.get('/tags/attachments' + (type ? '?type=' + type : ''));
  }

  public remove(tagId: string): Observable<any> {
    return this._http.delete('/tags/entity/' + tagId);
  }

  public save(tagId: string, tagObj: Tag): Observable<any> {
    return this._http.put('/tags/entity/' + tagId, tagObj);
  }

  /*
   * Pools routes
   */

  public getTagsFromPool(innovationId: string): Observable<Array<Tag>> {
    return this._http.get('/tags/' + innovationId + '/pool');
  }

  public searchTagInPool(innovationId: string, keyword: string): Observable<Array<Tag>> {
    return this._http.get('/tags/' + innovationId + '/pool/search', { params: {keyword: keyword }});
  }

  public addTagToPool(innovationId: string, tagId: string): Observable<any> {
    return this._http.post('/tags/' + innovationId + '/pool', { params: {tag: tagId }});
  }

  public updateTagInPool(innovationId: string, tag: Tag): Observable<any> {
    return this._http.put('/tags/' + innovationId + '/pool', { params: tag});
  }

  public removeTagFromPool(innovationId: string, tag: Tag): Observable<any> {
    return this._http.delete('/tags/' + innovationId + '/pool', { params: {tag: tag._id }});
  }

}
