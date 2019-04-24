import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../../models/tag';
import { TagStats } from '../../models/tag-stats';

@Injectable()
export class TagsService {

  constructor(private _http: HttpClient) {
  }

  public create(tagObj: Tag): Observable<any> {
    return this._http.post('/tags/entity', tagObj);
  }

  public get(id: string): Observable<any> {
    return this._http.get('/tags/entity/' + id);
  }

  public getStats(id: string): Observable<TagStats> {
    return this._http.get<TagStats>('/staqsdfts/tag/' + id);
  }

  public getAll(config: {[header: string]: string | string[]}): Observable<{result: Array<Tag>, _metadata: any}> {
    return this._http.get<{result: Array<Tag>, _metadata: any}>('/tags/entity', {params: config});
  }

  public getAttachments(type: string): Observable<{result: Array<any>, _metadata: any}> {
    return this._http.get<{result: Array<Tag>, _metadata: any}>('/tags/attachments' + (type ? '?type=' + type : ''));
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
    return this._http.get<Array<Tag>>('/tags/' + innovationId + '/pool');
  }

  public searchTagInPool(innovationId: string, keyword: string): Observable<Array<Tag>> {
    return this._http.get<Array<Tag>>('/tags/' + innovationId + '/pool/search', { params: {keyword: keyword }});
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

  public getSimilarTags(tagId: string): Observable<any> {
    return this._http.get<Array<Tag>>('/tags/' + tagId + '/match');
  }

}
