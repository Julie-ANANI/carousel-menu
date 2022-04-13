/**
 * Created by Abhishek SAINI on 13-04-2022
 */

import { Pipe, PipeTransform } from '@angular/core';
import {User} from '../../models/user.model';
import {Professional} from '../../models/professional';
import {UserFrontService} from '../../services/user/user-front.service';

type requested = 'fullName';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  transform(value: User | Professional, requested: requested): string {
    if (!value && !requested) return '';

    switch (requested) {
      case 'fullName':
        return UserFrontService.fullName(value);
    }
    return null;
  }

}
