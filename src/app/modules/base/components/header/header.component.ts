import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  private _backOfficeValue: boolean; // if true then display back office menu options.
  private _displayMenuOptions: boolean; // on small devices if true then display menu options.
  private _displayNavbar: boolean; // if true that means user is authenticated so display navbar.

  constructor(private authService1: AuthService,
              private location1: Location) {}

  ngOnInit() {
    this._displayNavbar = this.authService1.isAuthenticated;
    this._displayMenuOptions = false;
    this._backOfficeValue = false;
    this._backOfficeValue = this.location1.path().slice(0, 6) === '/admin';
  }

  public getLogo(): string {
    // return `logo-${ environment.domain || 'umi.us'}.png`;
    return environment.logoURL;
  }

  public canShow(reqLevel: number): boolean {
    return reqLevel && ( this.authService1.adminLevel & reqLevel) === reqLevel;
  }

  get authService(): AuthService {
    return this.authService1;
  }

  // to toggle the back office value.
  toggleBackOfficeState() {
    this._backOfficeValue = !this._backOfficeValue;
  }

  get backOfficeValue(): boolean {
    return this._backOfficeValue;
  }

  // to toggle the value of menu options display.
  toggleMenuState() {
    this._displayMenuOptions = !this._displayMenuOptions;
  }

  // set the menu display value false when click on link
  onClickLink() {
    this._displayMenuOptions = false;
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
