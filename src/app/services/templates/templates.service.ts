import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TemplatesService {

  constructor(private _http: Http) {
  }

  public create(templateObj: any): Observable<any> {
    return this._http.post('/template', templateObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<any> {
    return this._http.get('/template/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(config: any): Observable<any> {
    return this._http.get('/template/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(templateId: string): Observable<any> {
    return this._http.delete('/template/' + templateId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public save(templateObj: any): Observable<any> {
    return this._http.put('/template/' + templateObj._id, templateObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public createSignature(SignatureObj: any): Observable<any> {
    return this._http.post('/signature', SignatureObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getSignature(id: string): Observable<any> {
    return this._http.get('/signature/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAllSignatures(config: any): Observable<any> {
    return this._http.get('/signature/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public removeSignature(signatureId: string): Observable<any> {
    return this._http.delete('/signature/' + signatureId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public saveSignature(signatureObj: any): Observable<any> {
    return this._http.put('/signature/' + signatureObj._id, signatureObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public createEmail(EmailObj: any): Observable<any> {
    return this._http.post('/emailtemplate', EmailObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getEmail(id: string): Observable<any> {
    return this._http.get('/emailtemplate/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAllEmails(config: any): Observable<any> {
    return this._http.get('/emailtemplate/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public removeEmail(emailId: string): Observable<any> {
    return this._http.delete('/emailtemplate/' + emailId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public saveEmail(emailObj: any): Observable<any> {
    return this._http.put('/emailtemplate/' + emailObj._id, emailObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }
}
