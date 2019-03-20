import {Injectable} from "@angular/core";
import {User} from "../../../models/user.model";

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

  getUserSRT(userId: string) {
    /*return this.service
      .then(s => {
        s.getUser({id:userId}).then(p=>{}, err=>{})
      })
      .catch(err=>{
        console.error(err);
    });*/
    return this.service
      .then(s=>{
        return s.login({
          id: 'jdcruz-gomez@local.net',
          password: "12345678"
        });
      })

  }


}