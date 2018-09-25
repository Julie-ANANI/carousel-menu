import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { User } from '../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { Template } from '../../../sidebar/interfaces/template';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-client-my-account',
  templateUrl: './client-my-account.component.html',
  styleUrls: ['./client-my-account.component.scss']
})

export class ClientMyAccountComponent implements OnInit {

  private _formData: FormGroup;

  private _name: string;
  private _jobTitle: string;

  private _accountDeletionAsked = false;

  private _userProvider: string;

  private _countriesSuggestion: Array<string> = [];
  private _displayCountrySuggestion = false;

  private _profilePicture = '';

  private _sidebarTemplateValue: Template = {};

  private _sidebarState = new Subject<string>();

  // TODO : description, location

  constructor(private userService: UserService,
              private translateNotificationsService: TranslateNotificationsService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private translateTitleService: TranslateTitleService,
              private autoCompleteService: AutocompleteService) {}

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
      country: [''],
      sectors: [[]],
      technologies: [[]],
      language: ['', [Validators.required]]
    });
  }

  private patchForm() {
    this.userService.getSelf().subscribe((response: User) => {
      this._formData.patchValue(response);
      this._name = response.name;
      this._jobTitle = response.jobTitle;
      this._userProvider = response.provider;
      this._profilePicture = response.profilePic ? response.profilePic.url || '' : '';
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }

  onSuggestCountries() {
    this._formData.get('country').valueChanges.distinctUntilChanged().subscribe((input: any) => {
      this._displayCountrySuggestion = true;
      this._countriesSuggestion = [];
      this.autoCompleteService.get({query: input, type: 'countries'}).subscribe((res: any) => {
        if (res.length === 0) {
          this._displayCountrySuggestion = false;
        } else {
          res.forEach((items: any) => {
            const valueIndex = this._countriesSuggestion.indexOf(items.name);
            if (valueIndex === -1) { // if not exist then push into the array.
              this._countriesSuggestion.push(items.name);
            }
          })
        }
      });
    });
  }

  onValueSelect(value: string) {
    this._formData.get('country').setValue(value);
    this._displayCountrySuggestion = false;
  }

  showPasswordSidebar(event: Event) {
    event.preventDefault();

    this._sidebarTemplateValue = {
      animate_state: this._sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'MY_ACCOUNT.CHANGE'
    };

  }

  closeSidebar(value: string) {
    this._sidebarTemplateValue.animate_state = value;
    this._sidebarState.next('inactive');
  }

  onSubmit() {

    if (this._formData.valid) {
      const user = new User(this._formData.value);
      this.userService.update(user).first().subscribe(
        (response: User) => {
          this.translateNotificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ACCOUNT.UPDATE_TEXT');
          this._name = response.name;
          this._jobTitle = response.jobTitle;
          this._userProvider = response.provider;
          this._profilePicture = response.profilePic ? response.profilePic.url || '' : '';
          this._formData.patchValue(response);
        }, (error: any) => {
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
    this._accountDeletionAsked = true;
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._accountDeletionAsked = false;
  }

  deleteAccount (event: Event) {
    event.preventDefault();

    this.userService.delete().first().subscribe((_: any) => {
      this.authService.logout().first().subscribe(() => {
        this.translateNotificationsService.success('ERROR.ACCOUNT.DELETED', 'ERROR.ACCOUNT.DELETED_TEXT');
        this.router.navigate(['/']);
      });
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }

  hasProfilePic(): boolean {
    return !!this._profilePicture && this._profilePicture !== '';
  }

  changePassword(value: FormGroup) {
    const email = this._formData.get('email').value;
    const newPassword = value.value.newPassword;
    const confirmPassword = value.value.confirmPassword;

    if (newPassword === confirmPassword) {
      this.userService.changePassword({
        email: email, oldPassword: value.value.oldPassword, newPassword: newPassword, confirmPassword: confirmPassword
      }).first().subscribe(() => {
        this.showPasswordSidebar(event);
        this.translateNotificationsService.success('ERROR.ACCOUNT.PASSWORD_UPDATED', 'ERROR.ACCOUNT.PASSWORD_UPDATED_TEXT');
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ACCOUNT.OLD_PASSWORD');
      })
    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ACCOUNT.SAME_PASSWORD');
    }

  }

  get profilePicture(): string {
    return this._profilePicture;
  }

  set formData(value: FormGroup) {
    this._formData = value;
  }

  get formData(): FormGroup {
    return this._formData;
  }

  get name(): string {
    return this._name;
  }

  get jobTitle(): string {
    return this._jobTitle;
  }

  get accountDeletionAsked(): boolean {
    return this._accountDeletionAsked;
  }

  get userProvider(): string {
    return this._userProvider;
  }

  get countriesSuggestion(): Array<string> {
    return this._countriesSuggestion;
  }

  get displayCountrySuggestion(): boolean {
    return this._displayCountrySuggestion;
  }

  get sidebarTemplateValue(): Template {
    return this._sidebarTemplateValue;
  }

  get sidebarState(): Subject<string> {
    return this._sidebarState;
  }

  set sidebarState(value: Subject<string>) {
    this._sidebarState = value;
  }


}
