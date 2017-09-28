import { Component, OnInit, Input, Output } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-client-account-sidenav',
  templateUrl: './client-account-sidenav.component.html',
  styleUrls: ['./client-account-sidenav.component.scss']
})
export class ClientAccountSidenavComponent implements OnInit {

  @Input() show = false;

  private _user: User = new User();
  private _isAuthenticated = false;

  private _myInnovations: [any];

  constructor (private _authService: AuthService,
               private _userService: UserService) {}

  ngOnInit(): void {
    this._isAuthenticated = this._authService.isAuthenticated;

    if (this._isAuthenticated) {
        this._userService.getSelf().subscribe(user => {
          this._user = user;
        });
    }

    this._authService.isAuthenticated$.subscribe(isAuth => {
      const isAuthenticatedJustChanged = this._isAuthenticated !== isAuth;
      this._isAuthenticated = isAuth;
      if (isAuth && isAuthenticatedJustChanged) {
        this._userService.getSelf().subscribe(user => {
          this._user = user;
        });
      }
    });

    this._userService.getMyInnovations().subscribe(innovations => this._myInnovations = innovations.innovations);
  }


  get myInnovations(): [any] {
    return this._myInnovations;
  }

  get user (): User {
    return this._user;
  }
  get authService (): AuthService {
    return this._authService;
  }

}
