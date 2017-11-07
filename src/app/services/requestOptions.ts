import {BaseRequestOptions, RequestOptionsArgs} from '@angular/http';

export class RequestOptions extends BaseRequestOptions {
  // public token: string; // For token authentication

  constructor (options?: RequestOptionsArgs) {
    super();

    /* For token authentication
    const user = JSON.parse(localStorage.getItem('user'));
    this.token = user && user.token;
    this.headers.append('Authorization', 'Bearer ' + this.token);*/

    this.headers.append('Content-Type', 'application/json');

    if (options != null) {
      for (const option in options) {
        if (options.hasOwnProperty(option)) {
          const optionValue = options[option];
          this[option] = optionValue;
        }
      }
    }
  }
}
