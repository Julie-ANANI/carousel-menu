import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { UserService } from '../../../../services/user/user.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { User } from '../../../../models/user.model';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';
import { Compozer } from '../../../../utils/dynamic-form-compozer/classes/compozer';
import { TextboxCompozerComponent } from '../../../../utils/dynamic-form-compozer/classes/compozer-textbox';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-client-account',
  templateUrl: './client-account.component.html',
  styleUrls: ['./client-account.component.scss']
})
export class ClientAccountComponent implements OnInit {

  public compozerComponents: Compozer = new Compozer([
    [
      new TextboxCompozerComponent({
        key: 'firstName',
        label: 'COMMON.FIRSTNAME',
        type: 'text',
        placeholder: 'John',
        validators: Validators.required
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'lastName',
        label: 'COMMON.LASTNAME',
        type: 'text',
        placeholder: 'Doe',
        validators: Validators.required
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'companyName',
        label: 'COMMON.COMPANY',
        type: 'text',
        placeholder: 'United Motion Ideas',
        validators: Validators.required
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'jobTitle',
        label: 'COMMON.JOBTITLE',
        type: 'text',
        placeholder: 'Ingénieur en aérodynamisme', // TODO translate
        validators: Validators.required
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'email',
        label: 'COMMON.EMAIL',
        type: 'email',
        disabled: true,
        placeholder: 'john.doe@gmail.com',
        validators: [Validators.required, Validators.email]
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'phone',
        label: 'COMMON.PHONE',
        type: 'tel',
        placeholder: '+33 4 05 06 07 08'
      })
    ]
  ]);

  constructor(private _userService: UserService,
              private _translateService: TranslateService,
              private _notificationsService: NotificationsService,
              private _titleService: Title) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('My account'); // TODO translate
  }

  public formOnInit(form) {
    this._userService.getSelf().subscribe(user => {
      form.patchValue(user); // TODO form
    });
  }

  public onSubmit(form) {
    if (form.valid) {
      const user = new User(form.value);
      this._userService.update(user).subscribe(
          data => {
            this._notificationsService.success('Mise à jour réussie', 'Votre profil a été mis à jour'); // TODO translate
            form.patchValue(data);
          },
        error => {
          this._notificationsService.error('Erreur', error.message); // TODO translate
        });
    }
    else {
      this._notificationsService.error('Erreur', 'Formulaire non valide'); // TODO translate
    }
  }

}
