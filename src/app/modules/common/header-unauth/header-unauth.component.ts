import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SidebarInterface } from '../../sidebar/interfaces/sidebar-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { User } from '../../../models/user.model';
import { first, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MouseService } from '../../../services/mouse/mouse.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header-unauth',
  templateUrl: './header-unauth.component.html',
  styleUrls: ['./header-unauth.component.scss']
})

export class HeaderUnauthComponent implements OnInit, OnDestroy {

  private _sidebarValue: SidebarInterface = {};

  private _toggleSignInForm = false;

  private _formData: FormGroup;

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private translateNotificationsService: TranslateNotificationsService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private mouseService: MouseService,
              private formBuilder: FormBuilder) {

    this.mouseService.getClickEvent().pipe(takeUntil(this._ngUnsubscribe)).subscribe((event: Event) => {
      if (event && event.target && event.target['id'] !== 'button-signIn' && event.target['id'] !== 'header-unauth-signInForm'
        && event.target['parentNode']['id'] !== 'header-unauth-signInForm'
        && event.target['parentNode']['offsetParent']
        && event.target['parentNode']['offsetParent']['id'] !== 'header-unauth-signInForm') {
        this._toggleSignInForm = false;
        this._formData.reset();
      }
    });

  }

  ngOnInit() {
    this.buildForm();
  }


  private buildForm() {
    this._formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  /***
   * this function is called when the user clicks on the sign in button.
   * it will open the form wrapper.
   * @param event
   */
  onClickSignIn(event: Event) {
    event.preventDefault();
    this._toggleSignInForm = !this._toggleSignInForm;
  }


  /***
   * this function is called when the user clicks on the continue buttion in the
   * sign in form wrapper and redirect the user according to the requested page.
   */
  onClickContinue() {
    if (this._formData.valid) {
      const user = new User(this._formData.value);
      user.domain = environment.domain;

      this.authService.login(user).pipe(first()).subscribe(() => {
        this.checkUrlToRedirect();
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
        this._formData.get('password').reset();
      });

    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
      }
    }
  }


  /***
   * this function is to check url to redirect the user.
   */
  private checkUrlToRedirect() {
    const url = this.router.url;

    if (url.includes('/discover')) {
      this.router.navigate([url.replace('/discover', '/user/discover/')], {
        queryParams: this.activatedRoute.snapshot.queryParams
      });
    }

    if (url.includes('/share/synthesis')) {
      this.router.navigate([url.replace('/share', '/user')], {
        queryParams: this.activatedRoute.snapshot.queryParams
      });
    }
  }


  /***
   * this function open the sign up sidebar where user can
   * fill the details to register in the framework.
   * @param event
   */
  onClickSignUp(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.SIGN_UP',
      type: 'signup'
    }

  }


  /***
   * this function is to register the new client.
   * @param formValue
   */
  createUser(formValue: FormGroup) {
    if (formValue.valid) {
      const user = new User(formValue.value);
      user.domain = environment.domain;

      if (user.email.match(/umi.us/gi) && user.domain !== 'umi') {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_DOMAIN');
      } else {
        this.userService.create(user).pipe(first()).subscribe(() => {
          this.authService.login(user).pipe(first()).subscribe(() => {
            this.router.navigate(['/welcome']);
          }, () => {
            this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
          });
        }, () => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ALREADY_EXIST');
        });
      }

    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }

  getLogo(): string {
    return environment.logoURL;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get toggleSignInForm(): boolean {
    return this._toggleSignInForm;
  }

  get formData(): FormGroup {
    return this._formData;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
