import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PresetService {

  constructor(private _http: Http) {
  }

  public create(presetObj: any): Observable<any> {
    return this._http.post('/preset', presetObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<any> {
    return this._http.get('/preset/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public populatePreset(id: string): Observable<any> {
    return this._http.get('/preset/' + id + '/populate')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(config: any): Observable<any> {
    return this._http.get('/preset/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(presetId: string): Observable<any> {
    return this._http.delete('/preset/' + presetId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public save(presetId: string, presetObj: any): Observable<any> {
    return this._http.put('/preset/' + presetId, presetObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public createSection(SectionObj: any): Observable<any> {
    return this._http.post('/section', SectionObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getSection(id: string): Observable<any> {
    return this._http.get('/section/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAllSections(config: any): Observable<any> {
    return this._http.get('/section/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public removeSection(sectionId: string): Observable<any> {
    return this._http.delete('/section/' + sectionId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public saveSection(sectionId: string, sectionObj: any): Observable<any> {
    return this._http.put('/section/' + sectionId, sectionObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public createQuestion(questionObj: any): Observable<any> {
    return this._http.post('/question', questionObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getQuestion(id: string): Observable<any> {
    return this._http.get('/question/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAllQuestions(config: any): Observable<any> {
    return this._http.get('/question/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public removeQuestion(QuestionId: string): Observable<any> {
    return this._http.delete('/question/' + QuestionId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public saveQuestion(QuestionId: string, QuestionObj: any): Observable<any> {
    return this._http.put('/question/' + QuestionId, QuestionObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }


}
