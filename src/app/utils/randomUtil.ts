import { UUID } from "angular2-uuid";

export class RandomUtil {

  static generateRandomString(length: number, concat?: string): string {
    const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = [];

    for (let i = 0; i < length; i++) {
      text.push(POOL.charAt(Math.floor(Math.random() * POOL.length)));
    }

    return text.join('');
  }

  static generateUUID(): string {
    return UUID.UUID();
  }

}