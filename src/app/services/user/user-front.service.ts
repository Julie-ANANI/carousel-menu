import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { Professional } from "../../models/professional";

@Injectable({ providedIn: 'root' })
export class UserFrontService {

  /***
   * this function is to return the user full name.
   * @param user
   */
  public static fullName(user: User | Professional): string {
    if (user) {
      if (typeof User && (<User>user).name) {
        return (<User>user).name;
      } else if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      } else if (user.firstName) {
        return `${user.firstName}`;
      } else if (user.lastName) {
        return `${user.lastName}`;
      }
    }
    return '';
  }

  /***
   * returns the logo of the user company.
   * @param user
   */
  public static logo(user: User): string {
    return user && user.company && user.company.logo || ''
  }

  /***
   * this function is to get the initial of the user.
   * @param user | Contributor
   */
  public static initial(user: User): string {
    if (user) {
     if (user.firstName && user.lastName) {
        return `${user.firstName.slice(0, 1)}${user.lastName.slice(0, 1)}`;
      } else if (user.firstName) {
        return `${user.firstName.slice(0, 2)}`;
      } else if (user.lastName) {
        return `${user.lastName.slice(0, 2)}`;
      }
    }
    return '';
  }

}
