/*
import {Injectable} from "@angular/core";
import {User} from "../../../models/user.model";

import * as sha1 from 'js-sha1';

//declare let swellrt;

@Injectable()
export class SwellrtBackend {

  // swellrt's service interface
  service: Promise<any>;

  // the current logged in user
  session: Promise<any>;

  bind(service: Promise<any>) {
    this.service = service;
  }

  get() {
    return this.service;
  }

  createUser(user: User) {
    console.log(user);
    return this.service
      .then(s=>{
        return s.createUser({

          id: 'jdcruz-gomez',                // no add @domain part
          name: 'Juan David Cruz',         //
          password: '12345678',        //
          email: 'jdcruz-gomez@umi.us', // (Optional)
          locale: 'en_EN',          // (Optional)
        });
      }).catch( error => {
      console.log(error);
      });
  }

  loginSwellRT() {
    return this.service
      .then(s=>{
        let password = sha1("jdcruz-gomez@umi.us");
        return s.login({
          id: '5a325700e5e43d00018ceb09@local.net',
          password: password
        });
      });
  }

  getUserSRT(userId: string) {
    return this.service
      .then(s => {
        return s.getUser({id:userId});
      })
      .catch(err=>{
        console.error(err);
    });
  }


}
*/
