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

  private _formData: FormGroup;
  name: string;
  jobTitle: string;
  accountDeletionAsked = false;

  // TODO : profile picture, reset password, description, location

  constructor(private userService: UserService,
              private translateNotificationsService: TranslateNotificationsService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private translateTitleService: TranslateTitleService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('MY_ACCOUNT.TITLE');
    this.buildForm();
    this.patchForm();
  }

  private buildForm() {
    this._formData = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      companyName: [''],
      jobTitle: [''],
      phone: [''],
      sectors: [[]],
      technologies: [[]],
      language: ['', [Validators.required]]
    });
  }

  private patchForm() {
    this.userService.getSelf().subscribe((response: User) => {
      console.log(response);
      this._formData.patchValue(response);
      this.name = response.name;
      this.jobTitle = response.jobTitle;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }

  changePassword(event: Event) {
    event.preventDefault();
    this.userService.changePassword()
      .first()
      .subscribe(res => {
        this.router.navigate(['/reset-password/' + res.token])
      });
  }

  onSubmit() {
    if (this._formData.valid) {
      const user = new User(this._formData.value);
      this.userService.update(user).first().subscribe(
        (response: User) => {
          this.translateNotificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ACCOUNT.UPDATE_TEXT');
          this.name = response.name;
          this.jobTitle = response.jobTitle;
          this._formData.patchValue(response);
        },
        error => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
        });
    }
    else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }

  addSector(event: {value: Array<string>}) {
    this._formData.get('sectors')!.setValue(event.value);
  }

  addTechnology(event: {value: Array<string>}) {
    this._formData.get('technologies')!.setValue(event.value);
  }

  onDelete(event: Event) {
    event.preventDefault();
    this.accountDeletionAsked = true;
  }

  closeModal(event: Event) {
    event.preventDefault();
    this.accountDeletionAsked = false;
  }

  deleteAccount (event: Event) {
    event.preventDefault();

    this.userService.delete().first().subscribe(_ => {
      this.authService.logout().first().subscribe(() => {
        this.translateNotificationsService.success('ERROR.ACCOUNT.DELETED', 'ERROR.ACCOUNT.DELETED_TEXT');
        this.router.navigate(['/']);
      });
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }

  set formData(value: FormGroup) {
    this._formData = value;
  }

  get formData(): FormGroup {
    return this._formData;
  }

}
