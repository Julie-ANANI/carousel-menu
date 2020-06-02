import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { environment} from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';
import { isPlatformBrowser, Location } from '@angular/common';
import { User } from '../../../models/user.model';
import { Header } from './interface/header';
import { initTranslation, TranslateService } from '../../../i18n/i18n';
import { CookieService } from 'ngx-cookie';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SidebarInterface } from '../../sidebars/interfaces/sidebar-interface';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

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
        background: 'rgba(58,66,77,0.96)',
      })),
      transition('inactive => active', animate('.5ms ease-in-out')),
      transition('active => inactive', animate('700ms ease-in-out')),
    ])

  ]
})

export class HeaderComponent {

  private _backOfficeValue: boolean = false; // if true, then display back office menu options.

  private _displayMenuOptions: boolean = false; // on small devices if true then display menu options.

  private _flag: string;

  private _sidebarValues: SidebarInterface = {};

  private _showLangs = false;

  private _adminRoutes: Array<Header> = [
    // { pageName: 'Dashboard', pageLink: '/user/admin', adminLevel: 1 },
    { pageName: 'Market Tests', pageLink: '/user/admin/projects', adminLevel: 1 },
    { pageName: 'Users', pageLink: '/user/admin/users', adminLevel: 1 },
    { pageName: 'Community', pageLink: '/user/admin/community', adminLevel: 3 },
    { pageName: 'Professionals', pageLink: '/user/admin/professionals', adminLevel: 3 },
    { pageName: 'Libraries', pageLink: '/user/admin/libraries', adminLevel: 3 },
    { pageName: 'Monitoring', pageLink: '/user/admin/monitoring', adminLevel: 3 },
    { pageName: 'Settings', pageLink: '/user/admin/settings', adminLevel: 3 },
    { pageName: 'Search', pageLink: '/user/admin/search/pros', adminLevel: 3 },
  ];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _authService: AuthService,
              private _location: Location,
              private _router: Router,
              private _translateService: TranslateService,
              private _cookieService: CookieService) {

    this._initializeVariables();

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd
        || event instanceof NavigationCancel || event instanceof NavigationError) {
        this._backOfficeValue = this._location.path().slice(5, 11) === '/admin';
      }
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event) {
    if (window.innerWidth > 960) {
      this._sidebarValues.animate_state = 'inactive';
    }
  }

  /***
   * initializing all the variables.
   * @private
   */
  private _initializeVariables() {
    initTranslation(this._translateService);
    this._setFlag();
    this._sidebarValues.animate_state = 'inactive';
  }

  /***
   * based on the current lang show flag.
   * @private
   */
  private _setFlag() {
    this._flag = this.currentLang === 'en' ? 'US' : 'FR';
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
    this._sidebarValues.animate_state = 'active';
  }

  public closeSidebar() {
    this._sidebarValues.animate_state = 'inactive';
  }

  /***
   * set the menu display value false when click on link
   */
  public onClickLink() {
    this._displayMenuOptions = false;

    if (this._sidebarValues.animate_state === 'active') {
      this.closeSidebar();
    }

  }

  public onClickAccount() {
    this._backOfficeValue = false;
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
    return !!this.profilePicture && this.profilePicture !== '';
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  public getContactUrl(): string {
    return this.currentLang === 'fr' ? 'https://www.umi.us/fr/contact/' : 'https://www.umi.us/contact/';
  }

  public toggleLangOptions(event: Event) {
    event.preventDefault();
    this._showLangs = !this._showLangs;
  }

  get backOfficeValue(): boolean {
    return this._backOfficeValue;
  }

  get authService(): AuthService {
    return this._authService;
  }

  get user(): User {
    return this._authService.user;
  }

  get profilePicture(): string {
    return (!!this.user.profilePic) ? this.user.profilePic.url : '' ;
  }

  get userInitial(): string {
    return  this.user.firstName && this.user.lastName ?
      `${this.user.firstName.slice(0, 1)}${this.user.lastName.slice(0, 1)}` : this.user.firstName.slice(0, 2);
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get flag(): string {
    return this._flag;
  }

  get sidebarValues(): SidebarInterface {
    return this._sidebarValues;
  }

  get adminRoutes(): Array<Header> {
    return this._adminRoutes;
  }

  get showLangs(): boolean {
    return this._showLangs;
  }

  get displayMenuOptions(): boolean {
    return this._displayMenuOptions;
  }

}
