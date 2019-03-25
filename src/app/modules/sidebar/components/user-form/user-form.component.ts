import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../../models/user.model';
import { Innovation } from '../../../../models/innovation';
import { Professional } from '../../../../models/professional';
import { Campaign } from '../../../../models/campaign';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { environment } from '../../../../../environments/environment';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { Tag } from '../../../../models/tag';
import { QuizService } from '../../../../services/quiz/quiz.service';
import { isPlatformBrowser } from '@angular/common';
import { SearchService } from "../../../../services/search/search.service";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {

  @Input() set sidebarState(value: string) {
    if (value === undefined || value ===  'active') {
      this.buildForm();
      this._userForm.reset();
      this._editInstanceDomain = false;
    }
  }

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

  /*
     For type 'editUser', put the data into the attribute user and patch it to the formData
  */
  @Input() set user(value: User) {
    this._selectedProject = null;
    this._user = value;
    this.loadEditUser();
  };

  @Input() set type(type: string) {
    this._type = type;
    this.loadTemplate();
  }

  @Output() finalUserData = new EventEmitter<User>();

  @Output() finalProfessionalData = new EventEmitter<Professional>();

  private _isEditUser = false;

  private _isProfessional = false;

  private _isSelf =  false;

  private _userForm: FormGroup;

  private _countriesSuggestion: Array<string> = [];

  private _displayCountrySuggestion = false;

  private _selectedProject: String;

  private _projects: Array<Innovation> = [];

  private _user: User;

  private _pro: Professional = null;

  private _campaign: Campaign = null;

  private _editInstanceDomain = false;

  private _tags: Tag[] = [];

  private _type = '';

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

  private _proKeywords: Array<string> = null;

  constructor(@Inject(PLATFORM_ID) private platform: Object,
              private formBuilder: FormBuilder,
              private autoCompleteService: AutocompleteService,
              private translateService: TranslateService,
              private searchService: SearchService,
              private userService: UserService,
              private _authService: AuthService) {}

  ngOnInit() {
    this._user = new User();
  }


  private buildForm() {
    this._userForm = this.formBuilder.group( {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      roles: [''],
      isOperator: [false],
      profileUrl: [null],
      domain: [''],
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


  private loadProfessional() {
    if (this._pro && this._userForm) {
      this._userForm.get('companyName').setValue(this._pro.company);
      this._tags = this._pro.tags;
      this._userForm.patchValue(this._pro);
      this._proKeywords = null;
    }
  }


  private loadEditUser() {
    if (this._user) {
      this._isSelf = this._authService.userId === this._user.id;
      this._userForm.patchValue(this._user);
      this.loadInnovations();
    }
  }


  private loadInnovations(): void {
    if(this._user.id) {
      this.userService.getInnovations(this._user.id).pipe(first()).subscribe((innovations: any) => {
        this._projects = innovations.result;
      });
    }
  }

  selectProject(event: any) {
    this._selectedProject = event.target.value;
  }


  onClickSave() {
    if (this._isEditUser) {
      const user = new User(this._userForm.value);
      user.id = this._user.id;
      this.finalUserData.emit(user);
    } else if (this._isProfessional && this._type === 'professional') {
      const pro = this._userForm.value;
      pro._id = this._pro._id;
      pro.company = this._userForm.get('companyName').value;
      pro.tags = this._tags;
      this.finalProfessionalData.emit(pro);
    } else if (this._isProfessional && this._type === 'addPro') {
      this.finalProfessionalData.emit(this._userForm.value);
    }
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
          })
        }
      });
    });
  }


  onValueSelect(value: string) {
    this._userForm.get('country').setValue(value);
    this._displayCountrySuggestion = false;
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
    this._editInstanceDomain = true;
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
    this.searchService.getProKeywords(this._pro.personId).pipe(first()).subscribe((keywords: Array<string>) => {
      this._proKeywords = keywords;
    });
  }


  changeRole(event: Event) {
    if (event.target['checked']) {
      this._userForm.get('roles').setValue('admin');
    } else {
      this._userForm.get('roles').setValue('user');
    }
  }

  removeTag(tag: any) {
    this._tags.splice(this._tags.findIndex(value => value._id === tag._id), 1);
  }

  get isSuperAdmin(): boolean {
    return this._user.roles === "super-admin";
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

  get companyName(): string {
    return environment.companyShortName;
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

  get displayCountrySuggestion(): boolean {
    return this._displayCountrySuggestion;
  }

  get proKeywords(): Array<string> {
    return this._proKeywords;
  }

}
