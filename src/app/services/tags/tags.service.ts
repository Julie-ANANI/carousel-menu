import { Injectable } from '@angular/core';
import { Http, Response } from '../http.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Tag } from '../../models/tag';

@Injectable()
export class TagsService {

  constructor(private _http: Http) {
  }

  public create(tagObj: Tag): Observable<Tag> {
    return this._http.post('/tags/entity', tagObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public get(id: string): Observable<any> {
    return this._http.get('/tags/entity/' + id)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAll(config: any): Observable<{result: Array<Tag>, _metadata: any}> {
    return this._http.get('/tags/entity', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAttachments(type: string): Observable<{result: Array<any>, _metadata: any}> {
    return this._http.get('/tags/attachments' + (type ? '?type=' + type : ''))
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public remove(tagId: string): Observable<any> {
    return this._http.delete('/tags/entity/' + tagId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public save(tagId: string, tagObj: Tag): Observable<Tag> {
    return this._http.put('/tags/entity/' + tagId, tagObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  /*
   * Pools routes
   */

  public getTagsFromPool(innovationId: string): Observable<Array<Tag>> {
    return this._http.get('/tags/' + innovationId + '/pool')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public searchTagInPool(innovationId: string, keyword: string): Observable<Array<Tag>> {
    return this._http.get('/tags/' + innovationId + '/pool/search', { params: {keyword: keyword }})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public addTagToPool(innovationId: string, tagId: string): Observable<Array<Tag>> {
    return this._http.post('/tags/' + innovationId + '/pool', { params: {tag: tagId }})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public updateTagInPool(innovationId: string, tag: Tag): Observable<Array<Tag>> {
    return this._http.put('/tags/' + innovationId + '/pool', { params: tag})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public removeTagFromPool(innovationId: string, tag: Tag): Observable<Array<Tag>> {
    return this._http.delete('/tags/' + innovationId + '/pool', { params: {tag: tag._id }})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

}
