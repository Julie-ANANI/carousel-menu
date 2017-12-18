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
        .subscribe(user=>{
          this._userBasicData = user;
          this.formData.patchValue(user);
        }, error=>{
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

  public onSubmit(form) {
    if (form.valid) {
      const user = new User(form.value);
      //Verify other configurations that aren't in the form (like the operator configuration and the id)
      user.isOperator = this._userBasicData['isOperator'];
      user.id = this._userBasicData['id'];
      this._userService.updateOther(user).subscribe(
        data => {
          this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ACCOUNT.UPDATE_TEXT');
          form.patchValue(data);
        },
        error => {
          this._notificationsService.error('ERROR.ERROR', error.message);
        });
    }
    else {
      this._notificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }

  public addSector(event) {
    this.formData.get('sectors').setValue(event.value);
  }

  public addTechnology(event) {
    this.formData.get('technologies').setValue(event.value);
  }

  public isAdmin(): boolean {
    const roles = this._userBasicData['roles'];
    return _.includes(['admin', 'super-admin'], roles);
  }

  get isOperator(): boolean {
    return this._userBasicData['isOperator'];
  }

  set isOperator(value: boolean) {
    this._userBasicData['isOperator'] = value;
  }

  public deleteAccount () {
    this._userService.delete().subscribe((res) => {
      this._authService.logout().subscribe(() => {
        this._notificationsService.success('ERROR.ACCOUNT.DELETED', 'ERROR.ACCOUNT.DELETED_TEXT');
        this._router.navigate(['/']);
      });
    });
  }

}
