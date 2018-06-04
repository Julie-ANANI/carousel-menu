import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

import { User } from '../../models/user.model';

@Injectable()
export class UserService {

  // private _selfUserSnapshot: any; // TODO

  constructor(private _http: Http) {}

  public getMyInnovations(config?: any): Observable<any> {
    return this._http.get('/user/me/innovations', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getInnovations(userId: string): Observable<any> {
    return this._http.get(`/user/${userId}/innovations`)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public create(user: User): Observable<any> {
    return this._http.post('/user', user)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public changePassword(email?: string): Observable<any> {
    return this._http.post('/user/resetPassword', {email: email})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public updatePassword(data: {email: string, password: string, passwordConfirm: string, tokenEmail: string}): Observable<any> {
    return this._http.post('/user/updatePassword', data)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public update(user: User): Observable<any> {
    return this._http.put('/user/me', user)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public updateOther(user: User): Observable<any> {
    return this._http.put(`/user/${user._id}`, user)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public activate(state: string, tokenEmail?: string): Observable<any> {
    // On envoie emailToken pour vérifier l'adresse email.
    return this._http.put('/user/me', {state: state, tokenEmail: tokenEmail})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getSelf(): Observable<any> {
    return this._http.get('/user/me')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public get(userId: string): Observable<any> {
    return this._http.get('/user/' + userId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getAll(config?: any): Observable<any> {
    return this._http.get('/user', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public delete(): Observable<any[]> {
    return this._http.delete('/user/me')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public deleteUser(userId: string): Observable<any> {
    return this._http.delete(`/user/${userId}`)
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.json()));
  }

}
