import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  constructor(private _authService: AuthService) { }

  ngOnInit() {}

  /***
   * We are checking user is authenticated or not.
   * @returns {AuthService}
   */
  get authService(): AuthService {
    return this._authService;
  }

  /***
   * We are getting the logo of the company.
   * @returns {string}
   */
  getLogo(): string {
    return environment.logoURL;
  }

}
