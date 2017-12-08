import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { User } from '../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-my-account',
  templateUrl: './client-my-account.component.html',
  styleUrls: ['./client-my-account.component.scss']
})
export class ClientMyAccountComponent implements OnInit {

  public formData: FormGroup;
  public accountDeletionAsked = false;

  // TODO : profile picture, reset password, description, location

  constructor(private _userService: UserService,
              private _translateService: TranslateService,
              private _notificationsService: TranslateNotificationsService,
              private _authService: AuthService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _titleService: Title) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('My account'); // TODO translate

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

    this._userService.getSelf().subscribe(user => {
      this.formData.patchValue(user);
    });
  }

  public changePassword() {
    this._userService.changePassword().subscribe(res => {
      this._router.navigate(['/reset-password/' + res.token])
    });
  }

  public onSubmit(form) {
    if (form.valid) {
      const user = new User(form.value);
      this._userService.update(user).subscribe(
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

  public deleteAccount () {
    this._userService.delete().subscribe((res) => {
      this._authService.logout().subscribe(() => {
        this._notificationsService.success('ERROR.ACCOUNT.DELETED', 'ERROR.ACCOUNT.DELETED_TEXT');
        this._router.navigate(['/']);
      });
    });
  }

}
