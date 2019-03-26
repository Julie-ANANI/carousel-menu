import { UUID } from 'angular2-uuid';

export class RandomUtil {

  static generateUUID(): string {
    return UUID.UUID();
  }

}
