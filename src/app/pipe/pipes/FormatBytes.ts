import { Pipe, PipeTransform } from '@angular/core';
import {Bytes2Human} from '../../utils/bytes2human';

@Pipe ({
  name: 'FormatBytes'
})

export class FormatBytes implements PipeTransform {

  /**
   * Capitalize the first letter of a string.
   * @param value the size in bytes
   * @param unit the unit to be used
   * or just the first one (false by default)
   */
  transform (value: number, unit: string = 'Mb'): number {

    return Bytes2Human.convert(value, unit);

  }

}

