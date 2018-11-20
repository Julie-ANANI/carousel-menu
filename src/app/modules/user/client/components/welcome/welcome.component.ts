import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../../../services/user/user.service';
import { User } from '../../../../../models/user.model';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../../services/auth/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit {

  private _user: User;

  private _tokenEmail: string;

  constructor(private _authService: AuthService,
              private _userService: UserService,
              private _router: Router,
              private _translateService: TranslateService) {}

  ngOnInit() {
    this._user = this._authService.user;

    console.log(this._authService.isAuthenticated);

    if (!this._user) {
      this._router.navigate(['/logout']);
    } else if ( this._user.emailVerified ) {
      this._router.navigate(['/user/projects']);
    }

  }

  acceptTerms(event: Event): void {
    event.preventDefault();
    this._authService.user.state = 'confirmed';

    this._userService.activate(this._authService.user.state, this._tokenEmail)
      .pipe(first())
      .subscribe((res: any) => {
        if (res.emailVerified === true) {
          this._authService.emailVerified = true;
        }
        this._authService.isConfirmed = true;
        this._router.navigate(['/user/projects']);
      }, (error: any) => {
        this._router.navigate(['/logout']);
      });

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

  get tokenEmail(): string {
    return this._tokenEmail;
  }

  set tokenEmail(value: string) {
    this._tokenEmail = value;
  }

  get translate (): TranslateService {
    return this._translateService;
  }

  isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

}
