import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import { User } from '../../../../models/user.model';
import { Innovation } from '../../../../models/innovation';
import { Professional } from '../../../../models/professional';
import { Campaign } from '../../../../models/campaign';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import {distinctUntilChanged, first} from 'rxjs/operators';
import { Clearbit } from '../../../../models/clearbit';
import { Tag } from '../../../../models/tag';
import { QuizService } from '../../../../services/quiz/quiz.service';
import { isPlatformBrowser } from '@angular/common';
import { countries } from '../../../../models/static-data/country';
import { languages } from '../../../../models/static-data/languages';
import { SearchService } from '../../../../services/search/search.service';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import {ErrorFrontService} from '../../../../services/error/error-front.service';
import {RolesService} from '../../../../services/roles/roles.service';
import {EnterpriseService} from '../../../../services/enterprise/enterprise.service';
import {emailRegEx} from '../../../../utils/regex';
import {UmiusEnterpriseInterface} from '@umius/umi-common-component';
import {CommonService} from '../../../../services/common/common.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {

  get companySuggestion(): Array<Clearbit> {
    return this._companySuggestion;
  }

  @Input() canImpersonate = false;

  @Input() isEditable = false;

  @Input() canAffectAsAdmin = false;

  @Input() set sidebarState(value: string) {
    if (value === undefined || value ===  'active') {
      this._resetVariables();
    } else {
      this._userForm.reset();
    }
  }

  /*
      For type 'professional', put the data into the attribute user and patch it to the formData
   */
  @Input() set pro(value: Professional) {
    if (value) {
      this._isProfessional = true;
      this._selectedProject = null;
      value.country = this.getCountryName(value.country);
      //Guillaume
      value.language = this.getLanguages(value.language);
      this._pro = value;
      this.loadProfessional();
    }
  }

  @Input() set campaign(value: Campaign) {
    this._campaign = value;
  }

  /*
     For type 'editUser', put the data into the attribute user and patch it to the formData
  */
  @Input() set user(value: User) {
    if (value) {
      this._selectedProject = null;
      value.country = this.getCountryName(value.country);
      //Guillaume
      value.language = this.getLanguages(value.language);
      this._user = value;
      this.loadEditUser();
    }
  }

  @Input() set type(type: 'editUser' | 'professional' | 'addPro') {
    this._type = type;
    this.loadTemplate();
  }

  @Output() finalUserData = new EventEmitter<User>();

  @Output() finalProfessionalData = new EventEmitter<Professional>();

  private _isEditUser = false;

  private _isProfessional = false;

  private _isSelf =  false;

  private _userForm: FormGroup;

  private _company: Clearbit;

  private _newCompany: Clearbit | UmiusEnterpriseInterface;

  private _countriesSuggestion: Array<string> = [];

  private _languagesSuggestion: Array<string> = [];

  private _companySuggestion: Array<Clearbit> = [];

  private _displayCountrySuggestion = false;

  private _displayLanguageSuggestion = false;

  private _displayCompanySuggestion = false;

  private _selectedProject: String;

  private _projects: Array<Innovation> = [];

  private _user: User;

  private _pro: Professional = null;

  private _campaign: Campaign = null;

  private _editInstanceDomain = false;

  private _tags: Tag[] = [];

  private _type: 'editUser' | 'professional' | 'addPro';

  private _isProShielded = false;

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

  private _countries = countries;
  private _languages = languages;

  private _proKeywords: Array<string> = null;

  private _roles: Array<any> = [];

  constructor(@Inject(PLATFORM_ID) private platform: Object,
              private formBuilder: FormBuilder,
              private autoCompleteService: AutocompleteService,
              private router: Router,
              private translateService: TranslateService,
              private translateNotificationsService: TranslateNotificationsService,
              private searchService: SearchService,
              private userService: UserService,
              private _authService: AuthService,
              private _professionalService: ProfessionalsService,
              private _rolesService: RolesService,
              private _enterpriseService: EnterpriseService) {}

  ngOnInit() {
    this._user = new User();
    this._getRoles();
  }

  public adminLevel(): boolean {
    return this._authService.adminLevel >= 5;
  }

  private _resetVariables() {
    this.buildForm();
    this._editInstanceDomain = false;
    this._displayCountrySuggestion = false;
    this._displayCompanySuggestion = false;
  }

  private buildForm() {
    this._userForm = this.formBuilder.group( {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      company: this.formBuilder.group({name: [''], domain: [''], logo: ['']}),
      jobTitle: [''],
      email: ['', [Validators.required, Validators.pattern(emailRegEx)]],
      country: [''],
      //Guillaume
      language: [''],
      roles: [''],
      isOperator: [false],
      profileUrl: [null],
      domain: [''],
      phone: ['']
    });
  }

  private _getRoles() {
    const config = {
      fields: 'name',
      level: JSON.stringify({$gt: 0})
    };
    this._rolesService.get(config).pipe(first())
      .subscribe((roles: any) => {
        this._roles = roles.result || [];
      }, err => {
        if (err.status !== 401) {
          this.translateNotificationsService.error('Error', ErrorFrontService.getErrorKey(err.error));
        }
      });
  }

  private loadTemplate() {
    this.reinitialiseForm();
    if (this._type === 'editUser') {
      this._isEditUser = true;
      this.loadEditUser();
    } else if (this._type === 'professional') {
      this._isProfessional = true;
      this.loadProfessional();
    } else if (this._type === 'addPro') {
      this._isProfessional = true;
    }
  }

  private reinitialiseForm() {
    this._isProfessional = false;
    this._isEditUser = false;
    this._selectedProject = null;
  }

  private async loadProfessional() {
    if (this._pro && this._userForm) {
      if (this._pro['enterprise']) {
        this._enterpriseService.get(this._pro['enterprise']).pipe(first())
          .subscribe(enterprise => {
            this._userForm.get('company').get('name').setValue(enterprise.name);
          }, err => {
            console.error(err);
          });
      }
      this._tags = this._pro.tags;
      this._userForm.reset();
      this._userForm.patchValue(this._pro);
      this._proKeywords = null;
      this._professionalService.isShielded(this._pro._id)
        .subscribe(response => {
          this._isProShielded = response && response.result.length;
        }, err => {
          console.error(err);
        });
    }
  }

  private loadEditUser() {
    if (this._user) {
      this._isSelf = this._authService.userId === this._user.id;
      this._userForm.patchValue(this._user);
      this._company = this._user.company;
      this.loadInnovations();
    }
  }

  private loadInnovations(): void {
    if (this._user._id) {
      this.userService.getInnovations(this._user._id).subscribe((innovations: any) => {
        this._projects = innovations.result;
      });
    }
  }

  selectProject(event: any) {
    this._selectedProject = event.target.value;
  }

  public onCompanySelect(c: string | Clearbit | UmiusEnterpriseInterface) {
    this._userForm.get('company').reset((typeof c === 'string') ? {name: c} : c);
    this._newCompany = typeof c === 'string' ? {name: c} : c;
    this._displayCompanySuggestion = false;
  }

  public setRole(event: Event) {
    this._userForm.get('roles').setValue(event.target['value']);
  }

  onClickSave() {
    if (this.isEditable) {
      for (const code in this._countries) {
        if (this._countries[code] === this._userForm.get('country').value) {
          this._userForm.value['country'] = code;
        }
      }

      //Guillaume
      for (const code in this._languages) {
        if (this._languages[code].toLowerCase() === this._userForm.get('language').value.toLowerCase()) {
          this._userForm.value['language'] = code.toLowerCase();
        }
      }

      if (this._isEditUser) {
        const user = new User(this._userForm.value);
        // TODO we have to correct the problem of user.id || user._id
        user.id = this._user.id || this._user._id;
        this._editInstanceDomain = false;
        this.finalUserData.emit(user);
      } else if (this._isProfessional && this._type === 'professional') {
        const pro = this._userForm.value;
        pro._id = this._pro._id;
        pro.company = this._newCompany || pro.company;
        pro.tags = this._tags;
        this.finalProfessionalData.emit(pro);
      } else if (this._isProfessional && this._type === 'addPro') {
        const pro = this._userForm.value;
        pro.company = this._userForm.get('company.name').value;
        this.finalProfessionalData.emit(pro);
      }
    }
  }

  public onSuggestCompanies() {
    this._userForm.get('company.name').valueChanges.pipe(distinctUntilChanged()).subscribe((input: string) => {
      this._displayCompanySuggestion = true;
      this._companySuggestion = [];
      this.autoCompleteService.get({query: input, type: 'company'}).pipe(first()).subscribe((res: Array<Clearbit>) => {
        if (res.length === 0) {
          this._displayCompanySuggestion = false;
        } else {
          res.forEach((_item: Clearbit) => {
            const find = this._companySuggestion.find((_company) => _company.name === _item.name);
            if (!find) {
              this._companySuggestion.push(_item);
            }
          });
        }
        this._companySuggestion = CommonService.sortBy(this._companySuggestion, 'name');
      });
    });
  }

  onSuggestCountries() {
    this._userForm.get('country').valueChanges.pipe(distinctUntilChanged()).subscribe((input: any) => {
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
          });
        }
      });
    });
  }

  //Guillaume
  onSuggestLanguages() {
    this._userForm.get('language').valueChanges.pipe(distinctUntilChanged()).subscribe((input: any) => {
      this._displayLanguageSuggestion = true;
      this._languagesSuggestion = [];
      this.autoCompleteService.get({query: input, type: 'languages'}).subscribe((res: any) => {
        if (res.length === 0) {
          this._displayLanguageSuggestion = false;
        } else {
          res.forEach((items: any) => {
            const valueIndex = this._languagesSuggestion.indexOf(items.name);
            if (valueIndex === -1) { // if not exist then push into the array.
              this._languagesSuggestion.push(items.name);

            }
          });
        }
      });
    });
  }

  onValueSelect(value: string) {
    this._userForm.get('country').setValue(value);
    this._displayCountrySuggestion = false;
  }

  //Guillaume
  onValueSelectLanguage(value: string) {
    this._userForm.get('language').setValue(value[0].toUpperCase() + value.substr(1).toLowerCase());
    this._displayLanguageSuggestion = false;
  }

  openQuizUri(pro: Professional, event: Event): void {
    event.preventDefault();

    const quizUrl = QuizService.getQuizUrl(this._campaign, this.translateService.currentLang, pro._id);

    if (isPlatformBrowser(this.platform)) {
      window.open(quizUrl);
    }

  }


  getQuizUrl(pro: Professional): string {
    return QuizService.getQuizUrl(this._campaign, this.translateService.currentLang, pro._id);
  }


  startEditInstanceDomain(event: Event): void {
    event.preventDefault();
    if (this.isEditable) {
      this._editInstanceDomain = true;
    }
  }


  endEditInstanceDomain(event: {value: Array<{name: string}>}): void {
    this._editInstanceDomain = false;
    this._userForm.get('domain').setValue(event.value[0].name || 'umi');
  }


  buildInstanceDomainListConfig(): any {
    this._updateInstanceDomainConfig.initialData = [];
    return this._updateInstanceDomainConfig;
  }


  updateInstanceDomain(event: any): void {
    this.endEditInstanceDomain(event);
  }

  showKeywords() {
    this.searchService.getProKeywords(this._pro.personId).subscribe((keywords: Array<string>) => {
      this._proKeywords = keywords;
    });
  }


  changeRole(event: Event) {
    if (this.canAffectAsAdmin) {
      if ((event.target as HTMLInputElement).checked) {
        this._userForm.get('roles').setValue('admin');
      } else {
        this._userForm.get('roles').setValue('user');
      }
    }
  }


  removeTag(tag: any) {
    this._tags.splice(this._tags.findIndex(value => value._id === tag._id), 1);
  }


  getCountryName(value: string) {
    for (const code in this._countries) {
      if (code === value) {
        return this._countries[code];
      }
    }

    return value;

  }

  //Guillaume
  //Get language name from language code
  getLanguages(value: string) {
    for (const code in this._languages) {
      if (code === value) {
        return this._languages[code];
      }
    }

    return value;

  }

  public onEmailChange() {
    if (this._type === 'addPro' && this._userForm.get('email').valid) {
      const config = {
        fields: 'firstName lastName company email country language jobTitle campaigns innovations',
        limit: '1',
        offset: '0',
        search: '{}',
        email: this._userForm.get('email').value,
        sort: '{ "created": -1 }'
      };
      this._professionalService.getAll(config)
        .subscribe( response => {
          if (response && response.result && response.result.length) {
            this._userForm.patchValue(response.result[0]);
          }
        }, err => {
          this.translateNotificationsService.success('ERROR.ERROR', err.message);
        });
    }
  }

  public impersonateUser(event: Event) {
    event.preventDefault();
    if (this.canImpersonate) {
      // Ugly hack, but without it we cannot acces to 'id' field...
      const user = new User(this._user);
      user.id = this._user.id || this._user._id;
      this._authService.forceLogin(user.id).subscribe(response => {
        this.translateNotificationsService.success('ERROR.SUCCESS', '');
        this.router.navigate(['/user']);
      }, error => {
        console.log(error);
        const key = ErrorFrontService.getErrorKey(error.error);
        this.translateNotificationsService.error('ERROR.ERROR', key);
      });
    }
  }

  public resetLoginAttempts(event: Event) {
    event.preventDefault();
    const userId = this._user.id || this._user._id;
    this.userService.resetLoginAttempts(userId).pipe(first()).subscribe(result => {
      this.user = result;
      this.finalUserData.emit(this._user);
      }, err => {
      this.translateNotificationsService.error('ERROR.ERROR', err.message);
    });
  }

  public getLoginAttempts(): string {
    return `${!!this.user['attempts'] ? this.user['attempts'] : '0'} failed login attempt${!!this.user['attempts'] && this.user['attempts'] === 1 ? '' : 's'}`;
  }

  get isSuperAdmin(): boolean {
    return this._user.roles === 'super-admin';
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

  get tags(): Tag[] {
    return this._tags;
  }

  get projects(): Innovation[] {
    return this._projects;
  }

  get selectedProject(): String {
    return this._selectedProject;
  }

  get isEditUser(): boolean {
    return this._isEditUser;
  }

  get isProfessional(): boolean {
    return this._isProfessional;
  }

  get isSelf(): boolean {
    return this._isSelf;
  }

  get userForm(): FormGroup {
    return this._userForm;
  }

  get countriesSuggestion(): Array<string> {
    return this._countriesSuggestion;
  }

  //Guillaume
  get languagesSuggestion(): Array<string> {
    return this._languagesSuggestion;
  }

  get displayCountrySuggestion(): boolean {
    return this._displayCountrySuggestion;
  }

  //Guillaume
  get displayLanguageSuggestion(): boolean {
    return this._displayLanguageSuggestion;
  }

  get displayCompanySuggestion(): boolean {
    return this._displayCompanySuggestion;
  }

  get countries(): any {
    return this._countries;
  }

  //Guillaume
  get languages(): any {
    return this._languages;
  }

  get proKeywords(): Array<string> {
    return this._proKeywords;
  }

  get company() {
    return this._company;
  }

  set company(value: Clearbit) {
    this._company = value;
  }

  get type() {
    return this._type;
  }

  get isProShielded(): boolean {
    return this._isProShielded;
  }

  get roles(): Array<any> {
    return this._roles || [];
  }

}
