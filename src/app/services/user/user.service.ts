import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

import { User } from '../../models/user.model';

@Injectable()
export class UserService {

  private _selfUserSnapshot: any; // TODO

  constructor(private _http: Http) {}

  public getMyInnovations(): Observable<any> {
    return this._http.get('/user/me/innovations')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getInnovations(userId: string): Observable<any> {
    return this._http.get(`/user/${userId}/innovations`)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public create(user: User): Observable<any> {
    return this._http.post('/user', user.toJSON())
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public changePassword(email?: string): Observable<any> {
    return this._http.post('/user/resetPassword', {email: email})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public updatePassword(data: {email: string, password: string, passwordConfirm: string}): Observable<any> {
    return this._http.post('/user/resetPassword', data)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public update(user: User): Observable<any> {
    return this._http.put('/user/me', user.toJSON())
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

  public getAll(): Observable<any[]> {
    return this._http.get('/user')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

}
