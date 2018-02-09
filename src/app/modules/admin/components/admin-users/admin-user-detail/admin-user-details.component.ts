import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user/user.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { User } from '../../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import 'rxjs/add/operator/filter';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'app-admin-user-details',
  templateUrl: 'admin-user-details.component.html',
  styleUrls: ['admin-user-details.component.scss']
})
export class AdminUserDetailsComponent implements OnInit {

  public formData: FormGroup;
  public accountDeletionAsked = false;

  private _userBasicData = {};

  // TODO : profile picture, reset password, description, location

  constructor(private _userService: UserService,
              private _translateService: TranslateService,
              private _notificationsService: TranslateNotificationsService,
              private _authService: AuthService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('MY_ACCOUNT.TITLE');

    this._activatedRoute.params.subscribe(params => {
      const userId = params['userId'];
      this._userService.get(userId)
        .first()
        .subscribe((user) => {
          this._userBasicData = user;
          this.formData.patchValue(user);
        }, error => {
          console.error(error);
        });
    });

    this.formData = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      companyName: '',
      jobTitle: '',
      phone: '',
      sectors: [[]],
      technologies: [[]],
      language: ['', [Validators.required]]
    });
  }

  public onSubmit() {
    if (this.formData.valid) {
      const user = new User(this.formData.value);
      // Verify other configurations that aren't in the form (like the operator configuration and the id)
      user.isOperator = this._userBasicData['isOperator'];
      user.id = this._userBasicData['id'];
      user.roles = this._userBasicData['roles'];
      this._userService.updateOther(user)
        .first()
        .subscribe(
          data => {
            this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ACCOUNT.UPDATE_TEXT');
            this.formData.patchValue(data);
          },
          error => {
            this._notificationsService.error('ERROR.ERROR', error.message);
          });
    }
    else {
      this._notificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }

  public addSector(event: any) {
    this.formData.get('sectors').setValue(event.value);
  }

  public addTechnology(event: any) {
    this.formData.get('technologies').setValue(event.value);
  }

  public isAdmin(): boolean {
    const roles = this._userBasicData['roles'];
    return _.includes(['super-admin'], roles);
  }

  get domainAdmin(): boolean {
    const roles = this._userBasicData['roles'];
    return _.includes(['admin'], roles);
  }

  set domainAdmin(value: boolean) {
    this._userBasicData['roles'] = value ? 'admin' : 'user';
  }

  get isOperator(): boolean {
    return this._userBasicData['isOperator'];
  }

  set isOperator(value: boolean) {
    this._userBasicData['isOperator'] = value;
  }

  public deleteAccount () {
    this._userService.deleteUser(this._userBasicData['id'])
      .first()
      .subscribe((res) => {
        this._notificationsService.success('ERROR.ACCOUNT.DELETED', 'ERROR.ACCOUNT.DELETED_TEXT');
        this._router.navigate(['/admin/users']);
    });
  }

}
