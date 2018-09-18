import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  private _backOfficeValue: boolean; // if true then display back office menu options.
  private _displayMenuOptions: boolean; // on small devices if true then display menu options.
  private _displayNavbar: boolean; // if true that means user is authenticated so display navbar.
  user: User;
  profilePic: string;

  constructor(private _authService: AuthService,
              private _location: Location,
              private userService: UserService) {}

  ngOnInit() {
    this.userInfo();
    this._displayNavbar = this._authService.isAuthenticated;
    this._displayMenuOptions = false;
    this._backOfficeValue = false;
    this._backOfficeValue = this._location.path().slice(0, 6) === '/admin';
  }

  private userInfo() {
    this.userService.getSelf().first().subscribe((res: User) => {
      this.user = res;
      this.profilePic = res.profilePic ? res.profilePic.url || '' : '';
    });
  }

  getLogo(): string {
    // return `logo-${ environment.domain || 'umi.us'}.png`;
    return environment.logoURL;
  }

  canShow(reqLevel: number): boolean {
    return reqLevel && ( this._authService.adminLevel & reqLevel) === reqLevel;
  }

  // to toggle the back office value.
  toggleBackOfficeState() {
    this._backOfficeValue = !this._backOfficeValue;
  }

  // to toggle the value of menu options display.
  toggleMenuState() {
    this._displayMenuOptions = !this._displayMenuOptions;
  }

  // set the menu display value false when click on link
  onClickLink() {
    this._displayMenuOptions = false;
  }

  hasProfilePic(): boolean {
    return !!this.profilePic && this.profilePic !== '';
  }

  get backOfficeValue(): boolean {
    return this._backOfficeValue;
  }

  get authService(): AuthService {
    return this._authService;
  }

  get displayMenuOptions(): boolean {
    return this._displayMenuOptions;
  }

  get displayNavbar(): boolean {
    return this._displayNavbar;
  }

  ngOnDestroy(): void {
    this._displayNavbar = false;
    this._backOfficeValue = false;
  }

}
