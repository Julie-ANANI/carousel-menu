import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../../../../models/user.model';
import {Professional} from '../../../../models/professional';
import {Campaign} from '../../../../models/campaign';
import {AutocompleteService} from '../../../../services/autocomplete/autocomplete.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit, OnChanges {

  /*
     For type 'editUser', put the data into the attribute user and patch it to the formData
  */
  @Input() set user(value: User) {
    this._user = value;
    this.loadEditUser();
  };

  /*
      For type 'professional', put the data into the attribute user and patch it to the formData
   */
  @Input() set pro(value: Professional) {
    this._pro = value;
    this.loadProfessional();
  };

  @Input() set campaign(value: Campaign) {
    this._campaign = value;
  }

  @Input() sidebarState: string;

  @Input() set type(type: string) {
    if (type === 'signUp') {
      this.loadSignUp();
    }
  }

  @Output() userSignUpData = new EventEmitter<FormGroup>();
  @Output() editUserData = new EventEmitter<User>();
  @Output() professionalUserData = new EventEmitter<Professional>();

  isSignUp = false;
  isEditUser = false;
  isProfessional = false;
  isSelf =  false;
  userForm: FormGroup;
  countriesSuggestion: Array<string> = [];
  displayCountrySuggestion = false;
  private _user: User;
  private _pro: Professional = null;
  private _campaign: Campaign = null;
  private _editInstanceDomain = false;

  private _updateInstanceDomainConfig: {
    placeholder: string,
    initialData: Array<string>,
    type: string,
    identifier: string,
    canOrder: boolean
  } = {
    placeholder: 'Partners domain list',
    initialData: [],
    type: 'domain',
    identifier: 'name',
    canOrder: false
  };

  constructor(private formBuilder: FormBuilder,
              private autoCompleteService: AutocompleteService,
              private _translateService: TranslateService,
              private _authService: AuthService) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group( {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      country: ['', [Validators.required]],
      roles: '',
      operator: [false],
      url: [null],
      domain: ['']
    });

    this._user = new User();
  }

  loadSignUp() {
    this.isSignUp = true;
  }

  loadEditUser() {
    this.isEditUser = true;

    if (this._user) {
      this.isSelf = this._authService.userId === this._user.id;
      this.userForm.patchValue(this._user);
    }

  }

  loadProfessional() {
    this.isProfessional = true;
    if (this._pro) {
      this.userForm.get('companyName').setValue(this._pro.company);
      this.userForm.patchValue(this._pro);
    }
  }

  onSubmit() {
    if (this.isSignUp) {
      this.userSignUpData.emit(this.userForm);
    } else if (this.isEditUser) {
      const user = new User(this.userForm.value);
      user.id = this._user.id;
      this.editUserData.emit(user);
    } else if (this.isProfessional) {
      const pro = this.userForm.value;
      pro._id = this._pro._id;
      pro.company = this.userForm.get('companyName').value;
      this.professionalUserData.emit(pro);
    }
  }

  onSuggestCountries() {
    this.userForm.get('country').valueChanges.distinctUntilChanged().subscribe(input => {
      this.displayCountrySuggestion = true;
      this.countriesSuggestion = [];
      this.autoCompleteService.get({keyword: input, type: 'countries'}).subscribe(res => {
        if (res.length === 0) {
          this.displayCountrySuggestion = false;
        } else {
          res.forEach((items) => {
            const valueIndex = this.countriesSuggestion.indexOf(items.name);
            if (valueIndex === -1) { // if not exist then push into the array.
              this.countriesSuggestion.push(items.name);
            }
          })
        }
      });
    });
  }

  onValueSelect(value: string) {
    this.userForm.get('country').setValue(value);
    this.displayCountrySuggestion = false;
  }

  openQuizUri(pro: Professional, event: Event): void {
    event.preventDefault();
    const baseUri = environment.quizUrl + '/quiz/' + this.campaign.innovation.quizId + '/' + this.campaign._id;
    const parameters = '?pro=' + pro._id + '&lang=' + this._translateService.currentLang;
    window.open(baseUri + parameters);
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.isSignUp) {
      if (changes.sidebarState.currentValue !== changes.sidebarState.previousValue) {
        this.userForm.reset();
      }
    }
  }

  public startEditInstanceDomain(event: Event): void {
      this._editInstanceDomain = true;
  }

  public endEditInstanceDomain(event: {value: Array<{name: string}>}): void {
      this._editInstanceDomain = false;
      this.userForm.get('domain').setValue(event.value[0].name || 'umi');
  }

  public buildInstanceDomainListConfig(): any {
      this._updateInstanceDomainConfig.initialData = [];
      return this._updateInstanceDomainConfig;
  }

  public updateInstanceDomain(event: any): void {
      this.endEditInstanceDomain(event);
  }

  affectAsAdmin(check: boolean) {
    if (check === true) {
      this.userForm.get('roles').setValue('admin');
    } else {
      this.userForm.get('roles').setValue('user');
    }
  }

  get editInstanceDomain() {
    return this._editInstanceDomain;
  }

  get user(): User {
    return this._user;
  }

  get pro(): Professional {
    return this._pro;
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get authService(): AuthService {
    return this._authService;
  }

}
