import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { User } from '../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
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
              private _notificationsService: TranslateNotificationsService,
              private _authService: AuthService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('MY_ACCOUNT.TITLE');

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
    this._userService.changePassword()
      .first()
      .subscribe(res => {
        this._router.navigate(['/reset-password/' + res.token])
      });
  }

  public onSubmit() {
    if (this.formData.valid) {
      const user = new User(this.formData.value);
      this._userService.update(user)
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

  public addSector(event: {value: Array<string>}) {
    this.formData.get('sectors').setValue(event.value);
  }

  public addTechnology(event: {value: Array<string>}) {
    this.formData.get('technologies').setValue(event.value);
  }

  public deleteAccount () {
    this._userService.delete().first().subscribe((res) => {
      this._authService.logout().first().subscribe(() => {
        this._notificationsService.success('ERROR.ACCOUNT.DELETED', 'ERROR.ACCOUNT.DELETED_TEXT');
        this._router.navigate(['/']);
      });
    });
  }

}
