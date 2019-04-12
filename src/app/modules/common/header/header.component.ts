import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment} from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';
import { Location } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  private _backOfficeValue: boolean = false; // if true, then display back office menu options.

  private _displayMenuOptions: boolean = false; // on small devices if true then display menu options.

  private _profilePicture: string;

  name: string;

  constructor(private _authService: AuthService,
              private location: Location,
              private _userService: UserService) {

    this._userService.getSelf().subscribe((response: User) => {
      this.name = response.firstName && response.lastName ? `${response.firstName.slice(0, 1)}${response.lastName.slice(0, 1)}` :
        response.firstName.slice(0, 2);
      this._profilePicture = response.profilePic ? response.profilePic.url || '' : '';
    });

  }

  ngOnInit() {
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
  public onClickLink() {
    this._displayMenuOptions = false;
  }


  canShow(reqLevel: number): boolean {
    return reqLevel && ( this.authService.adminLevel & reqLevel) === reqLevel;
  }

  public getLogo(): string {
    return environment.logoURL;
  }

  public getCompany(): string {
    return environment.companyShortName;
  }

  public hasProfilePic(): boolean {
    return !!this._profilePicture && this._profilePicture !== '';
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

  isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get profilePicture(): string {
    return this._profilePicture;
  }

  ngOnDestroy(): void {
    this._backOfficeValue = false;
  }

}
