import { Component, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { environment} from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';
import { isPlatformBrowser, Location } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user.model';
import { Header } from './interface/header';
import { initTranslation, TranslateService } from '../../../i18n/i18n';
import { CookieService } from 'ngx-cookie';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SidebarInterface } from '../../sidebar/interfaces/sidebar-interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [

    trigger(('animateSidebar'), [
      state('inactive', style({
        opacity: 0,
        transform: 'translateX(-100%)'
      })),
      state('active', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('inactive => active', animate('400ms ease-in')),
      transition('active => inactive', animate('700ms ease-out')),
    ]),

    trigger(('animateSidebarBackdrop'), [
      state('inactive', style({
        display: 'none',
        opacity: 0,
        background: 'none'
      })),
      state('active', style({
        display: 'block',
        opacity: 1,
        background: 'rgba(0,0,0,0.75)',
      })),
      transition('inactive => active', animate('.5ms ease-in-out')),
      transition('active => inactive', animate('700ms ease-in-out')),
    ])

  ]
})

export class HeaderComponent implements OnDestroy {

  private _backOfficeValue: boolean = false; // if true, then display back office menu options.

  private _displayMenuOptions: boolean = false; // on small devices if true then display menu options.

  private _profilePicture: string;

  private _userInitial: string;

  private _email: string;

  private _name: string;

  private _currentLang: string;

  private _flag: string;

  private _sidebarValues: SidebarInterface = {};

  private _clientRoutes: Array<Header> = [
    { pageName: 'HEADER.DISCOVER', pageLink: '/discover', trackingClass: 'gtm-menu-discover' },
    { pageName: 'HEADER.SHARED_REPORTS', pageLink: '/user/synthesis', trackingClass: 'gtm-menu-my-projects' },
    { pageName: 'HEADER.MY_PROJECTS', pageLink: '/user/projects', trackingClass: 'gtm-menu-my-projects' },
    ];

  private _adminRoutes: Array<Header> = [
    { pageName: 'Dashboard', pageLink: '/user/admin', adminLevel: 1 },
    { pageName: 'Users', pageLink: '/user/admin/users', adminLevel: 1 },
    { pageName: 'Professionals', pageLink: '/user/admin/professionals', adminLevel: 3 },
    { pageName: 'Projects', pageLink: '/user/admin/projects', adminLevel: 1 },
    { pageName: 'Libraries', pageLink: '/user/admin/libraries', adminLevel: 3 },
    { pageName: 'Monitoring', pageLink: '/user/admin/monitoring', adminLevel: 3 },
    { pageName: 'Settings', pageLink: '/user/admin/settings', adminLevel: 3 }
  ];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _authService: AuthService,
              private _location: Location,
              private _userService: UserService,
              private _translateService: TranslateService,
              private _cookieService: CookieService) {

    this._userService.getSelf().subscribe((response: User) => {

      this._userInitial = response.firstName && response.lastName ?
        `${response.firstName.slice(0, 1)}${response.lastName.slice(0, 1)}` : response.firstName.slice(0, 2);

      this._email = response.email;
      this._name = response.name;
      this._profilePicture = response.profilePic ? response.profilePic.url || '' : '';

    });

    this._initializeVariables();

  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth > 840) {
      this._sidebarValues.animate_state = 'inactive';
    }
  }


  /***
   * initializing all the variables.
   * @private
   */
  private _initializeVariables() {
    initTranslation(this._translateService);
    this._currentLang = this._translateService.currentLang;
    this._setFlag();
    this._backOfficeValue = this._location.path().slice(5, 11) === '/admin';
    this._sidebarValues.animate_state = 'inactive';
  }


  /***
   * based on the current lang show flag.
   * @private
   */
  private _setFlag() {
    this._flag = this._currentLang === 'en' ? 'US' : 'FR';
  }


  /***
   * set the lang as current lang.
   * @param lang
   */
  public setLang(lang: string) {
    this._cookieService.put('user_lang', lang || 'en');

    if (isPlatformBrowser(this._platformId)) {
      document.location.reload();
    } else {
      this._currentLang = lang;
      this._translateService.use(lang || 'en');
      this._setFlag();
    }

  }


  /***
   * to toggle the back office value.
   */
  public toggleBackOfficeState() {
    this._backOfficeValue = !this._backOfficeValue;
  }


  /***
   * to toggle the value of menu options display.
   */
  public toggleMenuState() {
    this._displayMenuOptions = !this._displayMenuOptions;
    this._sidebarValues.animate_state = this._sidebarValues.animate_state === 'inactive' ? 'active' : 'inactive';
  }


  public closeSidebar() {
    this._sidebarValues.animate_state = 'inactive';
  }


  /***
   * set the menu display value false when click on link
   */
  public onClickLink() {
    this._displayMenuOptions = false;
  }


  public canShow(reqLevel: number): boolean {
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


  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }


  public getContactUrl(): string {
    return this._currentLang === 'fr' ? 'https://www.umi.us/fr/contact/' : 'https://www.umi.us/contact/';
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

  get profilePicture(): string {
    return this._profilePicture;
  }

  get userInitial(): string {
    return this._userInitial;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get flag(): string {
    return this._flag;
  }

  get sidebarValues(): SidebarInterface {
    return this._sidebarValues;
  }

  get clientRoutes(): Array<Header> {
    return this._clientRoutes;
  }

  get adminRoutes(): Array<Header> {
    return this._adminRoutes;
  }

  ngOnDestroy(): void {
    this._backOfficeValue = false;
  }

}
