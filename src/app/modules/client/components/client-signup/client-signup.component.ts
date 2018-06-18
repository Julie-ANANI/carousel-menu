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

  constructor(private _authService: AuthService,
              private userService: UserService,
              private _location: Location,
              private activatedRoute: ActivatedRoute,
              private translateTitleService: TranslateTitleService,
              private translateNotificationsService: TranslateNotificationsService,
              private userFormSidebarService: UserFormSidebarService) {
  }

  ngOnInit(): void {
    this.translateTitleService.setTitle('COMMON.SIGN_UP');

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.isInvitation = params['invitation'] && params['invitation'] === 'true';
    });

    // Listening to the form values from child.
    this.userFormSidebarService.getFormValue().subscribe((res: FormGroup) => {
      if (res !== null) {
        this.onSubmit(res);
      }
    });

  }

  linkedInSignUp(event: Event) {
    event.preventDefault();

    const domain = environment.domain;

    this._authService.linkedinLogin(domain).first().subscribe(url => {
          window.location.href = url;
        },
        error => {
          this.translateNotificationsService.error('ERROR.ERROR', error.message);
        }
      );

  }

  onSubmit(res: FormGroup) {
    if (res.valid) {
      const user = new User(res.value);

      user.domain = environment.domain;

      this.userService.create(user).first().subscribe(_ => {
            this._authService.login(user).first().subscribe(
              _ => {
                this._location.back();
              },
              error => {
                this.translateNotificationsService.error('ERROR.ERROR', error.message);
              }
            );
          },
          error => {
            this.translateNotificationsService.error('ERROR.ERROR', error.message);
          }
        );
    }
    else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
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
    this.userFormSidebarService.setTemplateValues('active', 'COMMON.SIGN_UP', 'Sign Up');
  }

}
