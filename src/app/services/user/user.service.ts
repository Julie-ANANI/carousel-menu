import { Injectable } from '@angular/core';
import { Http, Response } from '../http.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable()
export class UserService {

  constructor(private _http: Http) {}

  public getMyInnovations(config?: any): Observable<any> {
    return this._http.get('/user/me/innovations', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getInnovations(userId: string): Observable<any> {
    return this._http.get(`/user/${userId}/innovations`)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public create(user: User): Observable<any> {
    return this._http.post('/user', user.toJSON())
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public resetPassword(email?: string): Observable<any> {
    return this._http.post('/user/resetPassword', {email: email})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public changePassword(data: {email: string, oldPassword: string, newPassword: string, confirmPassword: string}): Observable<any> {
    return this._http.post('/user/me/changePassword', data)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public updatePassword(data: {email: string, password: string, passwordConfirm: string, tokenEmail: string}): Observable<any> {
    return this._http.post('/user/updatePassword', data)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public update(user: User): Observable<any> {
    return this._http.put('/user/me', user.toJSON())
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public updateOther(user: User): Observable<any> {
    return this._http.put(`/user/${user.id}`, user.toJSON())
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public activate(state: string, tokenEmail?: string): Observable<any> {
    // On envoie emailToken pour vérifier l'adresse email.
    return this._http.put('/user/me', {state: state, tokenEmail: tokenEmail})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getSelf(): Observable<any> {
    return this._http.get('/user/me')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public get(userId: string): Observable<any> {
    return this._http.get('/user/' + userId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAll(config?: any): Observable<any> {
    return this._http.get('/user', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public delete(): Observable<any[]> {
    return this._http.delete('/user/me')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public deleteUser(userId: string): Observable<any> {
    return this._http.delete(`/user/${userId}`)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

}
