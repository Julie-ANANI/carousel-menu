import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Template } from '../../../sidebar/interfaces/template';
import { Subject } from 'rxjs/Subject';
import { CurrentRouteService } from '../../../../services/frontend/current-route/current-route.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  private _backOfficeValue: boolean; // if true then display back office menu options.

  private _displayMenuOptions: boolean; // on small devices if true then display menu options.

  displayHeader: boolean;

  formData: FormGroup;

  displaySignInForm = false;

  signUpSidebarTemplateValue: Template = {};

  sidebarState = new Subject<string>();

  constructor(private _authService: AuthService,
              private _location: Location,
              private formBuilder: FormBuilder,
              private currentRouteService: CurrentRouteService) { }

  ngOnInit() {
    this.currentRouteService.getCurrentRoute().subscribe((value) => {
     this.displayHeader = !(value === '/forget' || value === '/signup' || value === '/login');
   });

    this.buildForm();

    this._displayMenuOptions = false;

    this._backOfficeValue = false;

    this._backOfficeValue = this._location.path().slice(0, 6) === '/admin';
  }

  /***
   * This is to listen the click event on the page.
   */
  @HostListener('mouseup', ['$event'])
  onMouseUp() {

    if (event.target['id'] !== 'signInForm' && event.target['parentNode']['id'] !== 'signInForm' && event.target['parentNode']['offsetParent']['id'] !== 'signInForm') {
      this.displaySignInForm = false;
    }

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
    this.displaySignInForm = true;
  }


  /***
   * This function close the sidebar and send the inactive state to the sidebar.
   * @param {Template} value
   */
  closeSidebar(value: Template) {
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

  }


  /***
   * We get the data from the sign in form and login the user.
   */
  onSignInSubmit() {

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
