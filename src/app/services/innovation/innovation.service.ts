import {Injectable} from "@angular/core";
import {Http, Response} from "../http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class InnovationService {

  constructor(private _http: Http) {
  }

  public create(innovationObj): Observable<any> {
    return this._http.post('/innovation/', innovationObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id): Observable<any> {
    return this._http.get('/innovation/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(): Observable<any> {
    return this._http.get('/innovation/')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public createInnovationCard(innovationId, innovationCardObj: any): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/innovationCard', innovationCardObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public removeInnovationCard(innovationId, innovationCardId): Observable<any> {
    return this._http.delete('/innovation/' + innovationId + '/innovationCard/' + innovationCardId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getInnovationCard(innovationCardId: string, lang: string): Observable<any> {
    return this._http.get('/innovation/card/' + innovationCardId, { params: {lang: lang }}) // TODO check si le serveur reçoit bien la langue
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getInnovationSythesis(innovationId: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/synthesis')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(innovationId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public save(innovationId: string, delta: any, innovationCardId?: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId, { delta: delta, innovationCardId: innovationCardId })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public updateSynthesis(innovationId: string, data: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/synthesis', { payload: data })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

}
