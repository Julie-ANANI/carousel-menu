import {emailRegEx, phoneRegEx} from "../utils/regex";
import {Model} from "./model";

export class User extends Model {

  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _phone: string;
  private _password: string;
  private _profilePicture: string;


  constructor(user?: any) {
    super(user);
  }

  get id(): string {
    return this._id;
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
}
