import { Model } from './model';

export class Innovation extends Model {

  private _id: string;
  private _name: string;

  constructor(innovation?: any) {
    super(innovation);
  }

  get id (): string {
    return this._id;
  }

  set id (id: string) {
    if (id) {
      this._id = id;
    }
  }

  get name (): string {
    return this._name;
  }

  set name (name: string) {
    if (name) {
      this._name = name;
    }
  }

}
