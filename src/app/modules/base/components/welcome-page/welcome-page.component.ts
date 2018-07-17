import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../../services/user/user.service';
import { User } from '../../../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})

export class WelcomePageComponent implements OnInit {

  private _user: User;
  public tokenEmail: string;

  constructor(private _authService: AuthService,
              private _userService: UserService,
              private _router: Router,
              private _translateService: TranslateService) { }

  ngOnInit() {
    this._user = this._authService.user;
    if (!this._user) {
      this._router.navigate(['/logout']);
    } else if ( this._user.emailVerified ) {
      this._router.navigate(['/project']);
    }
  }

  public acceptTerms(event: Event): void {
    event.preventDefault();
    this._authService.user.state = 'confirmed';
    this._userService.activate(this._authService.user.state, this.tokenEmail)
      .first()
      .subscribe(res => {
        if (res.emailVerified === true) {
          this._authService.emailVerified = true;
        }
        this._authService.isConfirmed = true;
        this._router.navigate(['/project']);
      }, error => {
        console.error(error);
        this._router.navigate(['/logout']);
      })
  }

  get name(): string {
    return this._user ? this._user['name'] : '';
  }

  get isAdmin(): boolean {
    if (this._user) {
      return this._user['isAdmin'] || (this._user['roles'] ? this._user['roles'] === 'super-admin' : false);
    }
    else {
      return false;
    }
  }

  get translate (): TranslateService {
    return this._translateService;
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

}
