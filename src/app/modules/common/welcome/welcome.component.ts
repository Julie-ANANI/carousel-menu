import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';
import { TranslateTitleService } from '../../../services/title/title.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit {

  private _user: User = <User>{};

  private _tokenEmail: string;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private translateService: TranslateService,
              private translateTitleService: TranslateTitleService) {

    this.translateTitleService.setTitle('COMMON.PAGE_TITLE.WELCOME');
    this._user = this.authService.user;
    console.log(this._user);

  }

  ngOnInit() {
    if (!this._user) {
      this.router.navigate(['/logout']);
    } else if (this._user.emailVerified) {
      this.router.navigate(['/']);
    }
  }

  acceptTerms(event: Event): void {
    event.preventDefault();

    this.authService.user.state = 'confirmed';

    this.userService.activate(this.authService.user.state, this._tokenEmail).subscribe((res: any) => {
      if (res.emailVerified === true) {
        this.authService.emailVerified = true;
      }
      this.authService.isConfirmed = true;
      this.router.navigate(['/']);
      }, () => {
      this.router.navigate(['/logout']);
    });

  }

  isMainDomain(): boolean {
    return environment.domain === 'umi';
  }


  get name(): string {
    return this._user ? this._user['name'] : '';
  }


  get isAdmin(): boolean {
    return !!this._user && this._user.roles === 'super-admin';
  }


  get tokenEmail(): string {
    return this._tokenEmail;
  }

  set tokenEmail(value: string) {
    this._tokenEmail = value;
  }

  get translate (): TranslateService {
    return this.translateService;
  }

}
