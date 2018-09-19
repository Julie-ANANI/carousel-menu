import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { User } from '../../../../models/user.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('animateWrapper', [
      state('false', style({
        display: 'none',
        opacity: 0,
        background: 'none'
      })),
      state('true', style({
        display: 'block',
        opacity: 1,
        background: 'rgba(0,0,0,0.65)'
      })),
      transition('false => true', animate('.5ms ease-in-out')),
      transition('true => false', animate('700.5ms ease-in-out'))
    ]),
    trigger('animateContent', [
      state('false', style({
        transform: 'translateX(100%)'
      })),
      state('true', style({
        transform: 'translateX(0)'
      })),
      transition('false <=> true', animate('700ms ease-in-out'))
    ])
  ]
})

export class HeaderComponent implements OnInit, OnDestroy {

  private _backOfficeValue = false; // if true then display back office menu options.

  private _displayNavbar: boolean; // if true that means user is authenticated so display navbar.

  private _user: User; // we are storing the user values to display the its data.

  private _displayMobileMenu = false; // display menu items when on mobile.

  private _profilePic: string;

  constructor(private _authService: AuthService,
              private _location: Location,
              private userService: UserService) {}

  ngOnInit() {
    this.userInfo();
    this._displayNavbar = this._authService.isAuthenticated;
    this._backOfficeValue = this._location.path().slice(0, 6) === '/admin';
  }

  private userInfo() {
    this.userService.getSelf().first().subscribe((res: User) => {
      this._user = res;
      this._profilePic = res.profilePic ? res.profilePic.url || '' : '';
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

  toggleMobileMenu(event: Event) {
    if (event.target['id'] === 'm-wrapper' || event.target['id'] === 'hamburger-icon') {
      this._displayMobileMenu = !this._displayMobileMenu;
    }
  }

  // set the menu display value false when click on link
  onClickLink() {
    this._displayMobileMenu = false;
  }

  hasProfilePic(): boolean {
    return !!this._profilePic && this._profilePic !== '';
  }

  get backOfficeValue(): boolean {
    return this._backOfficeValue;
  }

  get authService(): AuthService {
    return this._authService;
  }

  get displayNavbar(): boolean {
    return this._displayNavbar;
  }

  get user(): User {
    return this._user;
  }

  get displayMobileMenu(): boolean {
    return this._displayMobileMenu;
  }

  get profilePic(): string {
    return this._profilePic;
  }

  ngOnDestroy(): void {
    this._displayNavbar = false;
    this._backOfficeValue = false;
  }

}
