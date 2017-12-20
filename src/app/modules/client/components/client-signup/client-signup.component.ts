import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-client-signup',
  templateUrl: './client-signup.component.html',
  styleUrls: ['./client-signup.component.scss']
})
export class ClientSignupComponent implements OnInit {

  public displayEmailForm = false;
  public isInvitation = false;

  public formData: FormGroup;
  public passwordMinLength = 8;

  constructor(private _userService: UserService,
              private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _activatedRoute: ActivatedRoute,
              private _location: Location,
              private _titleService: TranslateTitleService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit(): void {
    this._titleService.setTitle('COMMON.SIGN_UP');

    this._activatedRoute.queryParams.subscribe((params: Params) => {
      this.isInvitation = params['invitation'] && params['invitation'] === 'true';
    });

    this.formData = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]]
    });
  }

  public linkedInSignIn() {
    const domain = environment.domain;
    this._authService.linkedinLogin(domain)
      .subscribe(
        url => {
          window.location.href = url;
        },
        error => {
          this._notificationsService.error('ERROR.ERROR', error.message);
        }
      );
  }

  public onSubmit({ value, valid }: { value: User, valid: boolean }) {
    if (valid) {
      const user = new User(value);
      user.domain = environment.domain;
      this._userService.create(user)
        .subscribe(
          data => {
            this._authService.login(user).subscribe(
              res => {
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
}
