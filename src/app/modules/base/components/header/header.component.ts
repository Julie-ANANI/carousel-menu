import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarInterface } from '../../../sidebar/interfaces/sidebar-interface';
import { Subject } from 'rxjs/Subject';
import { CurrentRouteService } from '../../../../services/frontend/current-route/current-route.service';
import { ListenerService } from '../../../../services/frontend/listener/listener.service';
import { User } from '../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  private _backOfficeValue: boolean; // if true, then display back office menu options.

  private _displayMenuOptions: boolean; // on small devices if true then display menu options.

  displayHeader: boolean; // if false, we are not showing header on login, signup and forget page.

  formData: FormGroup; // for the user sign in form.

  displaySignInForm = false; // to toggle the display of sign if box.

  signUpSidebarTemplateValue: SidebarInterface = {};

  sidebarState = new Subject<string>();

  constructor(private _authService: AuthService,
              private _location: Location,
              private formBuilder: FormBuilder,
              private currentRouteService: CurrentRouteService,
              private listenerService: ListenerService,
              private translateNotificationsService: TranslateNotificationsService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {

    // for the temporary
    const currentRoute = this.router.url;
    this.displayHeader = !(currentRoute === '/forget' || currentRoute === '/signup' || currentRoute === '/login');

    /***
     * this is to show and hide the header.
     */
    this.currentRouteService.getCurrentRoute().subscribe((value) => {
     this.displayHeader = !(value === '/forget' || value === '/signup' || value === '/login');
    });

    /***
     * this is to listen the click event.
     */
    this.listenerService.getClickEvent().subscribe((event: Event) => {
      if (event && event.target && event.target['id'] !== 'header-signInForm'
        && event.target['parentNode']['id'] !== 'header-signInForm'
        && event.target['parentNode']['offsetParent']
        && event.target['parentNode']['offsetParent']['id'] !== 'header-signInForm') {
          this.displaySignInForm = false;
      }
    });


    /***
     * If the user is authenticated we check the url to see if the user is trying to access
     * the share component, if yes, then we redirect him.
     */
    if (this.authService.isAuthenticated) {
      this.checkUrlToRedirect();
    }

    this.buildForm();

    this._displayMenuOptions = false;

    this._backOfficeValue = false;

    this._backOfficeValue = this._location.path().slice(0, 6) === '/admin';
  }

  private buildForm() {
    this.formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /***
   * This function open the user form sidebar where can fill its all details and after that
   * we redirect to him according to the url.
   * @param {Event} event
   */
  onSignUpClick(event: Event) {
    event.preventDefault();

    this.signUpSidebarTemplateValue = {
      animate_state: 'active',
      title: 'SIGN_UP.HEADING_SIDEBAR',
      type: 'isSignUp'
    };

    this.sidebarState.next(this.signUpSidebarTemplateValue.animate_state);

  }

  /***
   * On clicking the sign in button we show the sign in form.
   * @param {Event} event
   */
  onSignInClick(event: Event) {
    event.preventDefault();
    this.displaySignInForm = !this.displaySignInForm;
  }


  /***
   * This function close the sidebar and send the inactive state to the sidebar.
   * @param {SidebarInterface} value
   */
  closeSidebar(value: SidebarInterface) {
    if (value.type === 'isSignUp') {
      this.signUpSidebarTemplateValue.animate_state = 'inactive';
    }

    this.sidebarState.next('inactive');

  }

  /***
   * We get the data from the sidebar and register the user in the platform.
   * @param {FormGroup} res
   */
  onSignUpSubmit(res: FormGroup) {
    if (res.valid) {
      const user = new User(res.value);
      user.domain = environment.domain;
      if (user.email.match(/umi.us/gi) && user.domain !== 'umi') {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_DOMAIN');
      } else {
        this.userService.create(user).first().subscribe(() => {
          this.authService.login(user).first().subscribe(() => {
            this._location.back();
          }, () => {
            this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
          });
        }, () => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ALREADY_EXIST');
        });
      }
    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }

  /***
   * We get the data from the sign in form and login the user.
   */
  onSignInSubmit() {
    if (this.formData.valid) {
      const user = new User(this.formData.value);
      user.domain = environment.domain;
      this.authService.login(user).first().subscribe((response) => {
        if (this.authService.isAuthenticated) {
          this.checkUrlToRedirect();
        }
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
        this.formData.get('password').reset();
      });
    } else {
      if (this.formData.untouched && this.formData.pristine) {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
      }
    }
  }

  private checkUrlToRedirect() {

    if (this.router.url.includes('/share/synthesis/')) {
      this.router.navigate([this.router.url.replace('/share/synthesis/', '/synthesis/')]);
    }

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
    return reqLevel && ( this._authService.adminLevel & reqLevel) === reqLevel;
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

}
