import { Model } from './model';

export class Innovation extends Model {

  private _id: string;
  private _name: string;
  private _settings: object;

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

  get settings (): object {
    return this._settings;
  }

  set settings (settings: object) {
    if (settings) {
      this._settings = settings;
    }
  }

}
