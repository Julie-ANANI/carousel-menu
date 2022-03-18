/**
 * Created by Abhishek SAINI on 18-03-2022
 */

import { Pipe, PipeTransform } from '@angular/core';
import {CommonService} from '../../services/common/common.service';

type requested = 'LINKEDIN';

@Pipe({
  name: 'formalizeUrl'
})
export class FormalizeUrlPipe implements PipeTransform {

  transform(value: string, requested: requested): string {
    if (!value && !requested) return '';

    switch (requested) {
      case 'LINKEDIN':
        return CommonService.formalizeLinkedInUrl(value);
      default:
        return value;
    }
  }

}
