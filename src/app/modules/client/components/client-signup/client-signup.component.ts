import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';
import { TranslateService, initTranslation } from './i18n/i18n';
import { User } from '../../../../models/user.model';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-client-signup',
  templateUrl: './client-signup.component.html',
  styleUrls: ['./client-signup.component.scss']
})
export class ClientSignupComponent implements OnInit {

  public displayEmailForm = false;

  public formData: FormGroup;
  public passwordMinLength = 8;

  constructor(private _userService: UserService,
              private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _location: Location,
              private _titleService: Title,
              private _translateService: TranslateService,
              private _notificationsService: NotificationsService) { }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._translateService.get('COMMON.SIGN_UP').subscribe(title => this._titleService.setTitle(title));

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
          this._notificationsService.error('Erreur', error.message); // TODO translate
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
                this._notificationsService.error('Erreur', error.message); // TODO translate
              }
            );
          },
          error => {
            this._notificationsService.error('Erreur', error.message); // TODO translate
          }
        );
    }
    else {
      this._notificationsService.error('Erreur', 'Formulaire non valide'); // TODO translate
    }
  }
}
