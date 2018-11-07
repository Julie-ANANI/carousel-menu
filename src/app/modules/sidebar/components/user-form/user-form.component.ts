import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { Subject } from 'rxjs/Subject';
import { Tag } from '../../../../models/tag';
import { QuizService } from '../../../../services/quiz/quiz.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {

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

  @Input() set type(type: string) {
    this._type = type;
    this.loadTypes();
  }

  @Input() sidebarState: Subject<string>;

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

  constructor(private formBuilder: FormBuilder,
              private autoCompleteService: AutocompleteService,
              private translateService: TranslateService,
              private userService: UserService,
              private _authService: AuthService) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group( {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(9), Validators.pattern(/[\w]*[\&\@\$\.\#\+\=\/]+[\w]*/g)]],
      country: ['', [Validators.required]],
      roles: '',
      isOperator: [false],
      profileUrl: [null],
      domain: [''],
    });

    this._user = new User();

    this.loadTypes();

    if (this.sidebarState) {
      this.sidebarState.subscribe((state) => {
        if (state === 'inactive') {
          setTimeout (() => {
            this.userForm.reset();
          }, 500);
        }
      })
    }

  }

  loadInnovations(): void {
    this.userService.getInnovations(this._user.id)
      .first()
      .subscribe((innovations: any) => {
        this._projects = innovations.result;
      });
  }

  selectProject(event: any) {
    this._selectedProject = event.target.value;
  }

  reinitialiseForm() {
    this.isProfessional = false;
    this.isEditUser = false;
    this.isSignUp = false;
  }

  loadTypes() {
    this.reinitialiseForm();

    if (this._type === 'isSignUp') {
      this.isSignUp = true;
    } else if (this._type === 'editUser') {
      this.isEditUser = true;
      this.loadEditUser();
      this.loadInnovations();
    } else if (this._type === 'professional') {
      this.isProfessional = true;
      this.loadProfessional();
    }

  }

  loadEditUser() {
    if (this._user) {
      this.isSelf = this._authService.userId === this._user.id;
      this.userForm.patchValue(this._user);
    }

  }

  loadProfessional() {
    if (this._pro && this.userForm) {
      this.userForm.get('companyName').setValue(this._pro.company);
      this._tags = this._pro.tags;
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
      pro.tags = this._tags;
      this.professionalUserData.emit(pro);
    }
  }

  onSuggestCountries() {
    this.userForm.get('country').valueChanges.distinctUntilChanged().subscribe(input => {
      this.displayCountrySuggestion = true;
      this.countriesSuggestion = [];
      this.autoCompleteService.get({query: input, type: 'countries'}).subscribe(res => {
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
    const quizUrl = QuizService.getQuizUrl(this._campaign, this.translateService.currentLang, pro._id);
    window.open(quizUrl);
  }

  public getQuizUrl(pro: Professional): string {
    return QuizService.getQuizUrl(this._campaign, this.translateService.currentLang, pro._id);
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

  removeTag(tag: any) {
    this._tags.splice(this._tags.findIndex(value => value._id === tag._id), 1);
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

}
