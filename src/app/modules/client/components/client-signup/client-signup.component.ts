import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { User } from '../../../../models/user.model';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';
import { Compozer } from '../../../../utils/dynamic-form-compozer/classes/compozer';
import { TextboxCompozerComponent } from '../../../../utils/dynamic-form-compozer/classes/compozer-textbox';
import { Validators } from '@angular/forms';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-client-signup',
  templateUrl: './client-signup.component.html',
  styleUrls: ['./client-signup.component.styl']
})
export class ClientSignupComponent implements OnInit {

  public compozerComponents: Compozer = new Compozer([
    [
      new TextboxCompozerComponent({
        type: 'text',
        key: 'firstName',
        label: 'Firstname',
        placeholder: 'John',
        validators: Validators.required,
        materializeWidth: 's6'
      }),
      new TextboxCompozerComponent({
        type: 'text',
        key: 'lastName',
        label: 'Lastname',
        placeholder: 'Doe',
        validators: Validators.required,
        materializeWidth: 's6'
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'email',
        label: 'Email',
        placeholder: 'john.doe@gmail.com',
        validators: [Validators.required, Validators.email],
        type: 'email'
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'password',
        label: 'Password',
        placeholder: '••••••••••',
        validators: Validators.required,
        type: 'password'
      })
    ]
  ]);

  constructor(private _userService: UserService,
              private _authService: AuthService,
              private _location: Location,
              private _titleService: Title,
              private _translateService: TranslateService,
              private _notificationsService: NotificationsService) { }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('Sign up'); // TODO translate
  }

  public onSubmit(form) {
    if (form.valid) {
      const user = new User(form.value); // TODO vérifier que l'utilisateur est valide (s'il a un email) ...
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
