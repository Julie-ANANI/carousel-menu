export class Model {

  constructor(data?: any) {
    if (data) {
      for (const property of Object.getOwnPropertyNames(data)) {
        const self = this as any;
        self[property.replace(/^_/, '')] = data[property];
      }
    }
  }

  public toJSON() {
    const json: any = {};
    const self = this as any;
    for (let property of Object.getOwnPropertyNames(self)) {
      property = property.replace(/^_/, '');
      if (typeof self[property] !== 'undefined') {
        json[property] = self[property];
      }
    }
    return json;
  }
}
