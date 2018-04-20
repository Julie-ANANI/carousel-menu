import { emailRegEx, phoneRegEx } from '../utils/regex';
import { Model } from './model';

export class User extends Model {

  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _emailVerified: boolean;
  private _phone: string;
  private _password: string;
  private _profilePicture: string;
  private _domain: string;
  private _isOperator: boolean;
  private _roles: string;
  private _state: 'unconfirmed' | 'confirmed';
  private _companyName: string;
  private _jobTitle: string;


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

  set profilePicture(profilePicture: string) {
    if (profilePicture) {
      this._profilePicture = profilePicture;
    }
  }

  get profilePicture(): string {
    return this._profilePicture;
  }

  set domain(domain: string) {
    if (domain) {
      this._domain = domain;
    }
  }

  get domain(): string {
    return this._domain;
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

  get companyName(): string { return this._companyName; }
  set companyName(value: string) { this._companyName = value; }
  get jobTitle(): string { return this._jobTitle; }
  set jobTitle(value: string) { this._jobTitle = value; }
}
