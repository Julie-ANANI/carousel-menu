import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/filter';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { UserFormSidebarService } from '../../../shared/components/shared-sidebar/services/user-form-sidebar.service';
import { UserService } from '../../../../services/user/user.service';
import { User } from '../../../../models/user.model';


@Component({
  selector: 'app-client-signup',
  templateUrl: './client-signup.component.html',
  styleUrls: ['./client-signup.component.scss']
})

export class ClientSignupComponent implements OnInit {
  public isInvitation = false;

  constructor(
              private _authService: AuthService,
              private _userService: UserService,
              private _location: Location,
              private _activatedRoute: ActivatedRoute,
              private _titleService: TranslateTitleService,
              private _notificationsService: TranslateNotificationsService,
              private _userFormSidebarService: UserFormSidebarService)
  { }

  ngOnInit(): void {
    this._titleService.setTitle('COMMON.SIGN_UP');

    this._activatedRoute.queryParams.subscribe((params: Params) => {
      this.isInvitation = params['invitation'] && params['invitation'] === 'true';
    });

    // Listening to the form values from child.
    this._userFormSidebarService.getFormValue().subscribe((res: FormGroup) => {
      if (res !== null) {
        this.onSubmit(res);
      }
    });

  }

  public linkedInSignIn(event: Event) {
    event.preventDefault();
    const domain = environment.domain;
    this._authService.linkedinLogin(domain)
      .first()
      .subscribe(
        url => {
          window.location.href = url;
        },
        error => {
          this._notificationsService.error('ERROR.ERROR', error.message);
        }
      );
  }

  public onSubmit(res: FormGroup) {
    if (res.valid) {
      const user: User = res.value;
      user.domain = environment.domain;
      this._userService.create(user)
        .first()
        .subscribe(
          _ => {
            this._authService.login(user).first().subscribe(
              _ => {
                this._location.back();
              },
              error => {
                this._notificationsService.error('ERROR.ERROR', error.message);
              }
            );
          },
          error => {
            this._notificationsService.error('ERROR.ERROR', error.message);
          }
        );
    }
    else {
      this._notificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }

  get domainCompanyName(): string {
    return environment.companyName;
  }

  public checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  // getting the company logo.
  public getLogo(): string {
    return environment.logoURL;
  }

  // getting the background image.
  public backgroundImage(): string {
    return environment.background;
  }

  // Sending values to the child component "UserForm Sidebar"
  onSignUpClick(event: Event) {
    event.preventDefault();
    this._userFormSidebarService.setTemplateValues('active', 'COMMON.SIGN_UP', 'Sign Up');
  }

}
