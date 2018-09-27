import { Injectable } from '@angular/core';
import { Http, Response } from '../http.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TemplatesService {

  constructor(private _http: Http) {
  }

  public create(templateObj: any): Observable<any> {
    return this._http.post('/template', templateObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public get(id: string): Observable<any> {
    return this._http.get('/template/' + id)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAll(config: any): Observable<any> {
    return this._http.get('/template/', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public remove(templateId: string): Observable<any> {
    return this._http.delete('/template/' + templateId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public save(templateObj: any): Observable<any> {
    return this._http.put('/template/' + templateObj._id, templateObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public createSignature(SignatureObj: any): Observable<any> {
    return this._http.post('/signature', SignatureObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getSignature(id: string): Observable<any> {
    return this._http.get('/signature/' + id)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAllSignatures(config: any): Observable<any> {
    return this._http.get('/signature/', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public removeSignature(signatureId: string): Observable<any> {
    return this._http.delete('/signature/' + signatureId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public saveSignature(signatureObj: any): Observable<any> {
    return this._http.put('/signature/' + signatureObj._id, signatureObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public createEmail(EmailObj: any): Observable<any> {
    return this._http.post('/emailtemplate', EmailObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getEmail(id: string): Observable<any> {
    return this._http.get('/emailtemplate/' + id)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAllEmails(config: any): Observable<any> {
    return this._http.get('/emailtemplate/', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public removeEmail(emailId: string): Observable<any> {
    return this._http.delete('/emailtemplate/' + emailId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public saveEmail(emailObj: any): Observable<any> {
    return this._http.put('/emailtemplate/' + emailObj._id, emailObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }
}
