import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TemplatesService {

  constructor(private _http: HttpClient) {}

  public create(templateObj: any): Observable<any> {
    return this._http.post('/template', templateObj);
  }

  public get(id: string): Observable<any> {
    return this._http.get('/template/' + id);
  }

  public getAll(config: any): Observable<any> {
    return this._http.get('/template/', {params: config});
  }

  public remove(templateId: string): Observable<any> {
    return this._http.delete('/template/' + templateId);
  }

  public save(templateObj: any): Observable<any> {
    return this._http.put('/template/' + templateObj._id, templateObj);
  }

  public createSignature(SignatureObj: any): Observable<any> {
    return this._http.post('/signature', SignatureObj);
  }

  public getSignature(id: string): Observable<any> {
    return this._http.get('/signature/' + id);
  }

  public getAllSignatures(config: any): Observable<any> {
    return this._http.get('/signature/', {params: config});
  }

  public removeSignature(signatureId: string): Observable<any> {
    return this._http.delete('/signature/' + signatureId);
  }

  public saveSignature(signatureObj: any): Observable<any> {
    return this._http.put('/signature/' + signatureObj._id, signatureObj);
  }

  public createEmail(EmailObj: any): Observable<any> {
    return this._http.post('/emailtemplate', EmailObj);
  }

  public getEmail(id: string): Observable<any> {
    return this._http.get('/emailtemplate/' + id);
  }

  public getAllEmails(config: any): Observable<any> {
    return this._http.get('/emailtemplate/', {params: config});
  }

  public removeEmail(emailId: string): Observable<any> {
    return this._http.delete('/emailtemplate/' + emailId);
  }

  public saveEmail(emailObj: any): Observable<any> {
    return this._http.put('/emailtemplate/' + emailObj._id, emailObj);
  }
}
