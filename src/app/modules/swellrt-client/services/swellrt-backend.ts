/*
import {Injectable} from "@angular/core";
import {User} from "../../../models/user.model";

import * as sha1 from 'js-sha1';

//declare let swellrt;

@Injectable()
export class SwellrtBackend {

  // swellrt's service interface
  private _service: Promise<any>;

  // the current logged in user
  private _session: Promise<any>;

  public bind(service: Promise<any>) {
    this._service = service;
  }

  public get() {
    return this._service;
  }

  public getSession() {
    return this._session;
  }

  /**
   * Tries to recover a session for the user. If there's none to recover,
   * will try to use the user info to login
   * @param user
   */
  public startSwellRTSession(user: User) {
    this._session =
      this.restoreSession(user)
        .then( user => {
          console.log(`Session resumed for user ${user.id}`);
          return user;
        })
        .catch(err => {
        console.log(`There's no available session to resume: ${err.message}`);
        return this.loginSwellRT(user);
      });

    return this._session;
  }

  /**
   * Tries to restore a session
   * @param user
   */
  public restoreSession(user: User) {
    const id = `${user.id}@local.net`;
    return this._service
      .then(service => { return service.resume({id: id}); })
      .catch(err => {
        console.log(`There's no available session to resume: ${err}`);
      });
  }

  /**
   * Opens a new session using the id/password information
   * @param user
   */
  public loginSwellRT(user: User) {
    return this._service
      .then(service =>{
        const password = sha1(user.email);
        const id = `${user.id}@local.net`;
        return service.login({
          id: id,
          password: password
        });
      });
  }

  public logout() {
    return this._service
      .then( service => { return service.logout()} )
      .catch(err => {
        console.error(`I'm having problems (!) closing the session: ${err.message}`);
      });
  }

  /**
   * Opens a handle to a document using some id. In this case the id is defined by the
   * actual id of the document in mongodb.
   * @param id
   */
  public openDocument(id: string) {
    return this._service
      .then( service => { return service.open({id: id})})
      .catch( err => {`There's an error opening the document: ${err}`});
  }

  /**
   * Closes the handler to de documents and sets free all the listeners (??)
   * @param id
   */
  public closeDocument(id: string) {
    return this._service
      .then( service => { return service.close({id: id})})
      .catch( err => {`There's an error closing the document: ${err}`});
  }

  /*getUserSRT(userId: string) {
    return this.service
      .then(s => {
        return s.getUser({id:userId});
      })
      .catch(err=>{
        console.error(err);
    });
  }*/


}
*/
