import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserFrontService {

  /***
   * this function is to return the user full name.
   * @param user
   */
  public static fullName(user: User): string {
    if (user) {
      if (user.name) {
        return user.name;
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

}
