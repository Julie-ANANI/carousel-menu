import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteService } from '../../../../../../services/autocomplete/autocomplete.service';
import { User } from '../../../../../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit, OnChanges {

  @Input() sidebarState: string;

  /*
      For type 'editUser', put the data into the attribute user and patch it to the formData
   */
  @Input() set user(value: User) {
    this._user = value;
    this.loadEditUser();
  };

  @Input() set type(type: string) {
    if (type === 'signUp') {
      this.loadSignUp();
    } else if (type === 'professional') {
      this.loadProfessional();
    }
  }

  @Output() userSignUpData = new EventEmitter<FormGroup>();
  @Output() editUserData = new EventEmitter<User>();
  @Output() professionalUserData = new EventEmitter<FormGroup>();

  isSignUp = false;
  isEditUser = false;
  isProfessional = false;
  userForm: FormGroup;
  countriesSuggestion: Array<string> = [];
  displayCountrySuggestion = false;
  private _user: User = null;

  constructor(private formBuilder: FormBuilder,
              private autoCompleteService: AutocompleteService) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group( {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      company: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      country: ['', [Validators.required]],
      operator: [false],
      url: ['', [Validators.required]],
    });
  }

  loadSignUp() {
    this.isSignUp = true;
  }

  loadEditUser() {
    this.isEditUser = true;
    if (this._user) {
      this.userForm.patchValue(this._user);
    }
  }

  loadProfessional() {
    this.isProfessional = true;
  }

  onSubmit() {
    if (this.isSignUp) {
      this.userSignUpData.emit(this.userForm);
    } else if (this.isEditUser) {
      const user = new User(this.userForm.value);
      user.id = this._user.id;
      this.editUserData.emit(user);
    } else if (this.isProfessional) {
      this.professionalUserData.emit(this.userForm);
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

  ngOnChanges(changes: SimpleChanges): void {

    if (this.isSignUp) {
      if (changes.sidebarState.currentValue !== changes.sidebarState.previousValue) {
        this.userForm.reset();
      }
    }

  }

  get user(): User { return this._user };

}
