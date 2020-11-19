
export class Bytes2Human {

  static convert(value: number, unit: string = 'mb'): number {
    if (value) {
      switch (unit) {
        case('Mb'):
        case('MB'):
        case('mb'):
        case('Mo'):
        case('mo'):
          return Math.ceil(value / (1024 * 1024));
          break;
        case('Gb'):
        case('GB'):
        case('gb'):
        case('Go'):
        case('go'):
          return Math.ceil(value / (1024 * 1024 * 1024));
          break;
        case('Kb'):
        case('KB'):
        case('kb'):
        case('Ko'):
        case('ko'):
        default:
          return Math.ceil(value / 1024);
      }
    } else {
      return value;
    }
  }

}
