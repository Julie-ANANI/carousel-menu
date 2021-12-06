import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import {isPlatformBrowser} from '@angular/common';
import {User} from '../../../models/user.model';

@Component({
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})

export class ShareComponent implements OnInit {

  get isLoading(): boolean {
    return this._isLoading;
  }

  get authUser(): User {
    return this._authService.user;
  }

  get isAuthenticated(): boolean {
    return this._authService.isAuthenticated;
  }

  private _isLoading = true;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _authService: AuthService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false
    }
  }

}
