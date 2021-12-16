import { emailRegEx, phoneRegEx } from '../utils/regex';
import { Clearbit } from './clearbit';
import { Model } from './model';

export class User extends Model {

  _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _emailVerified: boolean;
  private _phone: string;
  private _language?: string;
  private _password: string;
  private _profilePic: any;
  private _domain: string;
  private _isOperator: boolean;
  private _roles: string;
  private _state: 'unconfirmed' | 'confirmed';
  private _company: Clearbit;
  private _jobTitle: string;
  private _country: string;
  private _provider: string;
  private _preferences: boolean;
  private _access?: {adminSide?: object};

  constructor(user?: any) {
    super(user);
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(firstName: string) {
    if (firstName) {
      this._firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(lastName: string) {
    if (lastName) {
      this._lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    }
  }

  get email(): string {
    if (emailRegEx.test(this._email)) {
      return this._email;
    }
    return null;
  }

  set email(email: string) {
    if (email && emailRegEx.test(email)) {
      this._email = email;
    }
  }

  get emailVerified(): boolean {
    return this._emailVerified;
  }

  set emailVerified(value: boolean) {
    this._emailVerified = value;
  }

  get phone(): string {
    if (phoneRegEx.test(this._phone)) {
      return this._phone;
    }
    return null;
  }

  set phone(phone: string) {
    if (phone && phoneRegEx.test(phone)) {
      this._phone = phone;
    }
  }

  set password(password: string) {
    if (password) {
      this._password = password;
    }
  }

  get password(): string {
    return this._password;
  }

  set profilePic(profilePicture: any) {
    if (profilePicture) {
      this._profilePic = profilePicture;
    }
  }

  get profilePic(): any {
    return this._profilePic;
  }

  set domain(domain: string) {
    if (domain) {
      this._domain = domain;
    }
  }

  get domain(): string {
    return this._domain;
  }

  set language(language: string) {
    if (language) {
      this._language = language;
    }
  }

  get language(): string {
    return this._language;
  }

  get isOperator(): boolean {
    return this._isOperator;
  }

  set isOperator(value: boolean) {
    this._isOperator = value;
  }

  get roles(): string {
    return this._roles;
  }

  set roles(value: string) {
    this._roles = value || 'user';
  }

  get state(): 'unconfirmed' | 'confirmed' {
    return this._state || 'unconfirmed';
  }

  set state(value: 'unconfirmed' | 'confirmed') {
    this._state = value;
  }

  get company(): Clearbit {
    return this._company;
  }

  set company(value: Clearbit) {
    this._company = value;
  }

  get jobTitle(): string {
    return this._jobTitle;
  }

  set jobTitle(value: string) {
    this._jobTitle = value;
  }

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  get provider(): string {
    return this._provider;
  }

  set provider(value: string) {
    this._provider = value;
  }


  get preferences(): boolean {
    return this._preferences;
  }

  set preferences(value: boolean) {
    this._preferences = value;
  }

  get access(): {adminSide?: object} {
    return this._access;
  }

  set access(value: {adminSide?: object}) {
    this._access = value;
  }

}
