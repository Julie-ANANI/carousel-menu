import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Tag } from '../../models/tag';
import { Config } from '../../models/config';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private _http: HttpClient) {}

  public getMyInnovations(config?: {
    [header: string]: string | string[];
  }): Observable<any> {
    return this._http.get('/user/me/innovations', { params: config });
  }

  public getInnovations(userId: string): Observable<any> {
    return this._http.get(`/user/${userId}/innovations`);
  }

  public getSharedWithMe(config?: {
    [header: string]: string | string[];
  }): Observable<any> {
    return this._http.get('/user/me/sharedwithme', { params: config });
  }

  public create(user: User): Observable<any> {
    return this._http.post('/user', user.toJSON());
  }

  public changePassword(data: {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    return this._http.post('/user/me/changePassword', data);
  }

  public updatePassword(data: {
    email: string;
    password: string;
    passwordConfirm: string;
    tokenEmail: string;
  }): Observable<any> {
    return this._http.post('/user/updatePassword', data);
  }

  public resetLoginAttempts(userId: string): Observable<any> {
    return this._http.put(`/user/${userId}/resetLoginAttempts`, {});
  }

  public update(user: User): Observable<any> {
    return this._http.put('/user/me', user.toJSON());
  }

  public updateOther(user: User): Observable<any> {
    return this._http.put(`/user/${user.id}`, user);
  }

  public activate(state: string, tokenEmail?: string): Observable<any> {
    // On envoie emailToken pour vérifier l'adresse email.
    return this._http.put('/user/me', { state: state, tokenEmail: tokenEmail });
  }

  public getSelf(): Observable<any> {
    return this._http.get('/user/me');
  }

  // todo check for the config in the back
  public get(userId: string, config?: any): Observable<User> {
    return this._http.get<User>('/user/' + userId, { params: config });
  }

  public getAll(config?: {
    [header: string]: string | string[];
  }): Observable<Array<User>> {
    return this._http.get<Array<User>>('/user', { params: config });
  }

  public getCommercials(config?: Config): Observable<Array<User>> {
    const _config = config || {
      roles: 'commercial',
      fields: '_id firstName lastName email phone',
      sort: '{"firstName": 1}',
    };
    return this._http.get<Array<User>>('/user', { params: _config });
  }

  public resetPassword(email?: string): Observable<any> {
    return this._http.post('/user/resetPassword', {
      email: email,
      callback: environment.clientUrl,
    });
  }


  public delete(): Observable<any> {
    return this._http.delete('/user/me');
  }

  public deleteUser(userId: string): Observable<any> {
    return this._http.delete(`/user/${userId}`);
  }

  public getRecommendation(userId: string): Observable<any> {
    return this._http.get<Array<Tag>>('/user/' + userId + '/match');
  }

  public createSwellUsers(): Observable<any> {
    return this._http.post('/misc/swellrt/synchronizeUsers', {});
  }

  public contactUMISupport(data: any): Observable<any> {
    return this._http.post('/user/contactUMI', data);
  }
}
