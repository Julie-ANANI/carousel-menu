import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { TranslateService, initTranslation } from './i18n/i18n';

@Component({
  selector: 'app-client-welcome',
  templateUrl: 'client-welcome.component.html',
  styleUrls: ['client-welcome.component.scss']
})
export class ClientWelcomeComponent implements OnInit {

  private _user = {};

  constructor(private _authService: AuthService,
              private _userService: UserService,
              private _router: Router,
              private _translateService: TranslateService) { }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._user = this._authService.user;
    if(!this._user) {
      this._router.navigate(['/logout']);
    }
  }

  public acceptTerms(): void {
    this._authService.user.state = 'confirmed';
    this._userService.activate(this._authService.user.state)
      .subscribe(res=>{
        this._authService.isConfirmed = true;
        this._router.navigate(['/projects']);
      }, error=>{
        console.error(error);
        this._router.navigate(['/logout']);
      })
  }

  get name(): string {
    return this._user ? this._user['name'] : "";
  }

  get isAdmin(): boolean {
    return this._user ? this._user['isAdmin'] : false;
  }
}
