import {Component, Input, OnInit} from '@angular/core';
import { UserService } from '../../../../../../services/user/user.service';
import { User } from '../../../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import 'rxjs/add/operator/filter';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-edit-sidebar',
  templateUrl: './user-edit-sidebar.component.html',
  styleUrls: ['./user-edit-sidebar.component.scss']
})
export class UserEditSidebarComponent implements OnInit {

  public formData: FormGroup;

  @Input() set userId(value: string) {
    this.loadUser(value);
  }

  // TODO : profile picture, location

  constructor(private _userService: UserService,
              private _notificationsService: TranslateNotificationsService,
              private _formBuilder: FormBuilder) {}

  ngOnInit(): void {

    this.formData = this._formBuilder.group({
      isOperator: false,
      firstName: '',
      lastName: '',
      email: ['', [Validators.email]],
      companyName: '',
      jobTitle: '',
      language: ''
    });
  }

  public onSubmit() {
    if (this.formData.valid) {
      const user = new User(this.formData.value);
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

  loadUser(id: string) {
    this._userService.get(id).subscribe(user => {
      this.formData.patchValue(user);
    });
  }

}
