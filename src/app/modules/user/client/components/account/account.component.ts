import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserService } from '../../../../../services/user/user.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { User } from '../../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AutocompleteService } from '../../../../../services/autocomplete/autocomplete.service';
import { SidebarInterface } from '../../../../sidebar/interfaces/sidebar-interface';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { countries } from '../../../../../models/static-data/country';
import { Observable } from 'rxjs';
import {Clearbit} from "../../../../../models/clearbit";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {

  private _formData: FormGroup;

  private _name: string;

  private _jobTitle: string;

  private _modalDelete = false;

  private _userProvider: string;

  private _countriesSuggestion: Array<string> = [];

  private _displayCountrySuggestion = false;

  private _profilePicture = '';

  private _sidebarValue: SidebarInterface = {};

  private _countries = countries;

  // TODO : description, location

  constructor(private userService: UserService,
              private translateNotificationsService: TranslateNotificationsService,
              private authService: AuthService,
              private sanitizer: DomSanitizer,
              private formBuilder: FormBuilder,
              private router: Router,
              private translateTitleService: TranslateTitleService,
              private autoCompleteService: AutocompleteService) {

    this.translateTitleService.setTitle('COMMON.PAGE_TITLE.ACCOUNT');

  }

  ngOnInit() {
    this.buildForm();
    this.patchForm();
  }

  private buildForm() {
    this._formData = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      company: this.formBuilder.group({name: [''], domain: [''], logo: ['']}),
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
      response.country = this.getCountryName(response.country);
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
    this._formData.get('country').valueChanges.pipe(distinctUntilChanged()).subscribe((input: any) => {
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

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.CHANGE_PASSWORD'
    };

  }

  public companiesSuggestions = (searchString: string): Observable<Array<{name: string, domain: string, logo: string}>> => {
    return this.autoCompleteService.get({query: searchString, type: 'company'});
  };

  public autocompleteCompanyListFormatter = (data: any): SafeHtml => {
    return this.sanitizer.bypassSecurityTrustHtml(`<img src="${data.logo}" height="22" alt=" "/><span>${data.name}</span>`);
  };

  public selectCompany(c: string | Clearbit) {
    this._formData.get('company').reset((typeof c === 'string') ? {name: c} : c);
  }

  onSubmit() {
    if (this._formData.valid) {

      for (let code in this._countries) {
        if (this._countries[code] === this._formData.get('country').value) {
          this._formData.value['country'] = code;
        }
      }

      const user = new User(this._formData.value);

      this.userService.update(user).subscribe((response: User) => {
        this.translateNotificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ACCOUNT.UPDATE_TEXT');
        this._name = response.name;
        this._jobTitle = response.jobTitle;
        this._userProvider = response.provider;
        this._profilePicture = response.profilePic ? response.profilePic.url || '' : '';
        response.country = this.getCountryName(response.country);
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
    this._modalDelete = true;
  }


  onClickSubmit(event: Event) {
    this.userService.delete().pipe(first()).subscribe((_: any) => {
      this.authService.logout().pipe(first()).subscribe(() => {
        this.translateNotificationsService.success('ERROR.ACCOUNT.DELETED', 'ERROR.ACCOUNT.DELETED_TEXT');
        this.router.navigate(['/login']);
      });
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  hasProfilePic(): boolean {
    return !!this._profilePicture && this._profilePicture !== '';
  }


  updatePassword(value: FormGroup) {
    const email = this._formData.get('email').value;
    const newPassword = value.value.newPassword;
    const confirmPassword = value.value.confirmPassword;

    if (newPassword === confirmPassword) {
      this.userService.changePassword({
        email: email, oldPassword: value.value.oldPassword, newPassword: newPassword, confirmPassword: confirmPassword
      }).pipe(first()).subscribe(() => {
        this.showPasswordSidebar(event);
        this.translateNotificationsService.success('ERROR.ACCOUNT.PASSWORD_UPDATED', 'ERROR.ACCOUNT.PASSWORD_UPDATED_TEXT');
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ACCOUNT.OLD_PASSWORD');
      })
    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ACCOUNT.SAME_PASSWORD');
    }

  }


  getCountryName(value: string) {
    for (let code in this._countries) {
      if (code === value) {
        return this._countries[code];
      }
    }

    return value;

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

  get modalDelete(): boolean {
    return this._modalDelete;
  }

  set modalDelete(value: boolean) {
    this._modalDelete = value;
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

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get countries(): any {
    return this._countries;
  }

}
