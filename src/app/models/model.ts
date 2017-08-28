export class Model {

  constructor(data?: any) {
    if (data) {
      for (const property of Object.getOwnPropertyNames(data)) {
        this[property.replace(/^_/, '')] = data[property];
      }
    }
  }

  public toJSON() {
    const json = {};
    for (let property of Object.getOwnPropertyNames(this)) {
      property = property.replace(/^_/, '');
      if (typeof this[property] !== 'undefined') {
        json[property] = this[property];
      }
    }
    return json;
  }
}
