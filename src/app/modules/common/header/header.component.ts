import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment} from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  private _backOfficeValue: boolean; // if true, then display back office menu options.

  private _displayMenuOptions: boolean; // on small devices if true then display menu options.

  constructor(private _authService: AuthService,
              private location: Location) { }

  ngOnInit() {
    this._displayMenuOptions = false;
    this._backOfficeValue = false;
    this._backOfficeValue = this.location.path().slice(5, 11) === '/admin';
  }


  /***
   * to toggle the back office value.
   */
  toggleBackOfficeState() {
    this._backOfficeValue = !this._backOfficeValue;
  }

  /***
   * to toggle the value of menu options display.
   */
  toggleMenuState() {
    this._displayMenuOptions = !this._displayMenuOptions;
  }

  /***
   * set the menu display value false when click on link
   */
  onClickLink() {
    this._displayMenuOptions = false;
  }

  canShow(reqLevel: number): boolean {
    return reqLevel && ( this.authService.adminLevel & reqLevel) === reqLevel;
  }

  get backOfficeValue(): boolean {
    return this._backOfficeValue;
  }

  getLogo(): string {
    return environment.logoURL;
  }

  get authService(): AuthService {
    return this._authService;
  }

  get displayMenuOptions(): boolean {
    return this._displayMenuOptions;
  }

  ngOnDestroy(): void {
    this._backOfficeValue = false;
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

}
