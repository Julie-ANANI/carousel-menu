import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { environment} from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';
import {isPlatformBrowser} from '@angular/common';
import { User } from '../../../models/user.model';
import { TranslateService} from '../../../i18n/i18n';
import { CookieService } from 'ngx-cookie';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SidebarInterface } from '../../sidebars/interfaces/sidebar-interface';
import { UserFrontService } from '../../../services/user/user-front.service';
import { Subject } from 'rxjs';
import { RolesFrontService } from '../../../services/roles/roles-front.service';
import { RouteFrontService } from '../../../services/route/route-front.service';
import {takeUntil} from 'rxjs/operators';

interface Header {
  pageName: string;
  pageLink: string;
  trackingClass?: string;
  key: string;
  subRoutes?: Array<string>; // put the key of the sub-routes
}

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

export class HeaderComponent implements OnInit, OnDestroy {

  get isMobileView(): boolean {
    return this._isMobileView;
  }

  private _backOfficeValue = false; // if true, then display back office menu options.

  private _flag = this.currentLang === 'fr' ? 'FR' : 'US';

  private _sidebarValues: SidebarInterface = {
    animate_state: 'inactive'
  };

  private _showLangs = false;

  private _adminRoutes: Array<Header> = [
    { pageName: 'Market Tests', pageLink: '/user/admin/projects', key: 'projects' },
    { pageName: 'Users', pageLink: '/user/admin/users', key: 'users' },
    { pageName: 'Community', pageLink: '/user/admin/community', key: 'community' },
    { pageName: 'Professionals', pageLink: '/user/admin/professionals', key: 'professionals',
      subRoutes: ['list', 'statistics']
    },
    {
      pageName: 'Libraries',
      pageLink: '/user/admin/libraries',
      key: 'libraries',
      subRoutes: ['workflows', 'emails', 'questionnaire', 'signatures']
    },
    { pageName: 'Monitoring', pageLink: '/user/admin/monitoring', key: 'monitoring' },
    {
      pageName: 'Settings',
      pageLink: '/user/admin/settings',
      key: 'settings',
      subRoutes: ['blocklist', 'countries', 'enterprises'] },
    {
      pageName: 'Search',
      pageLink: '/user/admin/search',
      key: 'search',
      subRoutes: ['pros', 'history', 'queue', 'scraping']
    },
  ];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _company = environment.companyShortName;

  private _logo = environment.logoSynthURL;

  private _isMainDomain = environment.domain === 'umi';

  private _isLoading = true;

  private _isMobileView = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _authService: AuthService,
              private _routeFrontService: RouteFrontService,
              private _rolesFrontService: RolesFrontService,
              private _translateService: TranslateService,
              private _cookieService: CookieService) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._checkMobileView();
      this._routeFrontService.isAdminSide().pipe(takeUntil(this._ngUnsubscribe)).subscribe((value) => {
        this._backOfficeValue = value;
      });
      this._isLoading = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event) {
    this._checkMobileView();
    if (window.innerWidth > 960) {
      this._sidebarValues = { animate_state: 'inactive' };
    }
  }

  private _checkMobileView() {
    this._isMobileView = window.innerWidth < 960;
  }

  /***
   * based on the current lang show flag.
   * @private
   */
  private _setFlag() {
    this._flag = this.currentLang === 'fr' ? 'FR' : 'US';
  }

  /***
   * set the lang as current lang.
   * @param lang
   */
  public setLang(lang: string) {
    this._cookieService.put('user_lang', lang || 'en');
    this._translateService.use(lang || 'en');
    this._setFlag();
  }

  /***
   * to toggle the value of menu options display.
   */
  public toggleMenuState() {
    this._sidebarValues = { animate_state: 'active' };
  }

  public closeSidebar() {
    this._sidebarValues = { animate_state: 'inactive' };
  }

  /***
   * set the menu display value false when click on link
   */
  public onClickLink() {
    if (this._sidebarValues.animate_state === 'active') {
      this.closeSidebar();
    }
  }

  public canAccessRoute(key: string) {
    return this._rolesFrontService.hasAccessAdminSide([key]);
  }

  public adminRouteLink(key: string, pageLink: string, subRoutes?: Array<string>) {
    if (subRoutes && subRoutes.length) {
      return pageLink + '/' + this._rolesFrontService.canAccessRoute(subRoutes, key.split(', '));
    }
    return pageLink;
  }

  public hasProfilePic(): boolean {
    return !!this.profilePicture && this.profilePicture !== '';
  }

  public toggleLangOptions(event: Event) {
    event.preventDefault();
    this._showLangs = !this._showLangs;
  }

  get adminDefaultRoute(): string {
    return this._routeFrontService.adminDefaultRoute();
  }

  get hasAdminSide(): boolean {
    return this._authService.hasAdminSide();
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
    return UserFrontService.initial(this.user);
  }

  get userName(): string {
    return UserFrontService.fullName(this.user);
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

  get company(): string {
    return this._company;
  }

  get logo(): string {
    return this._logo;
  }

  get isMainDomain(): boolean {
    return this._isMainDomain;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
