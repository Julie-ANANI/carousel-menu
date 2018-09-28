import { Injectable } from '@angular/core';
import { Http } from '../http.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable()
export class UserService {

  constructor(private _http: Http) {}

  public getMyInnovations(config?: any): Observable<any> {
    return this._http.get('/user/me/innovations', {params: config});
  }

  public getInnovations(userId: string): Observable<any> {
    return this._http.get(`/user/${userId}/innovations`);
  }

  public create(user: User): Observable<any> {
    return this._http.post('/user', user.toJSON());
  }

  public resetPassword(email?: string): Observable<any> {
    return this._http.post('/user/resetPassword', {email: email});
  }

  public changePassword(data: {email: string, oldPassword: string, newPassword: string, confirmPassword: string}): Observable<any> {
    return this._http.post('/user/me/changePassword', data);
  }

  public updatePassword(data: {email: string, password: string, passwordConfirm: string, tokenEmail: string}): Observable<any> {
    return this._http.post('/user/updatePassword', data);
  }

  public update(user: User): Observable<any> {
    return this._http.put('/user/me', user.toJSON());
  }

  public updateOther(user: User): Observable<any> {
    return this._http.put(`/user/${user.id}`, user.toJSON());
  }

  public activate(state: string, tokenEmail?: string): Observable<any> {
    // On envoie emailToken pour vérifier l'adresse email.
    return this._http.put('/user/me', {state: state, tokenEmail: tokenEmail});
  }

  public getSelf(): Observable<any> {
    return this._http.get('/user/me');
  }

  public get(userId: string): Observable<any> {
    return this._http.get('/user/' + userId);
  }

  public getAll(config?: any): Observable<any> {
    return this._http.get('/user', {params: config});
  }

  public delete(): Observable<any> {
    return this._http.delete('/user/me');
  }

  public deleteUser(userId: string): Observable<any> {
    return this._http.delete(`/user/${userId}`);
  }

}
