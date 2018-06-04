export interface User {

  _id?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  emailVerified?: boolean;
  readonly phone?: string;
  readonly password?: string;
  readonly profilePicture?: string;
  domain?: string;
  isOperator?: boolean;
  roles?: string;
  state?: 'unconfirmed' | 'confirmed';
  readonly companyName?: string;
  readonly jobTitle?: string;

}
