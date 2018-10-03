import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';
import { Template } from '../sidebar/interfaces/template';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})

export class ShareComponent implements OnInit {
  signUpSidebarTemplateValue: Template = {};

  sidebarState = new Subject<string>();

  formData: FormGroup;

  displaySignInForm = false;

  constructor(private _authService: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.checkUserLogin();
  }


  private checkUserLogin() {
    if (this.authService.isAuthenticated) {
      console.log('authenticated');
    } else {
      console.log('not-authenticated');
    }
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
   * We are checking user is authenticated or not.
   * @returns {AuthService}
   */
  get authService(): AuthService {
    return this._authService;
  }

  /***
   * We are getting the logo of the company.
   * @returns {string}
   */
  getLogo(): string {
    return environment.logoURL;
  }

}
