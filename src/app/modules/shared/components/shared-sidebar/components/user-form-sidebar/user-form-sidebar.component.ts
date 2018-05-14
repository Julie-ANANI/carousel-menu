import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AutocompleteService } from '../../../../../../services/autocomplete/autocomplete.service';
import { UserFormSidebarService } from '../../services/user-form-sidebar.service';

@Component({
  selector: 'app-user-form-sidebar',
  templateUrl: './user-form-sidebar.component.html',
  styleUrls: ['./user-form-sidebar.component.scss'],
  animations: [
    trigger('sidebarAnimate', [
      state('inactive', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('inactive => active', animate('700ms ease-in-out'))
    ])
  ]
})

export class UserFormSidebarComponent implements OnInit {

  private _userForm: FormGroup;
  private _countriesSuggestion: Array<string> = [];
  private _displayCountrySuggestion = false;
  private _title: string; // Sidebar heading
  private _state: string; // animation state
  private formType: string; // get the form type

  constructor(private _formBuilder: FormBuilder,
              private _autoCompleteService: AutocompleteService,
              private _userFormSidebarService: UserFormSidebarService)
  {}


  ngOnInit() {
    this.state = 'inactive';

    this._userForm = this._formBuilder.group( {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      company: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      country: ['', [Validators.required]],
      terms: ['', [Validators.requiredTrue]]
    });

    // getting the template values sent by the parent component.
    this._userFormSidebarService.getTemplateValues().subscribe(res => {
      if (res !== null) {
        this.state = res.animate;
        this.title = res.title;
        this.formType = res.type.toLowerCase();
      }
    });

  }

  onSuggestCountries() {
    this.userForm.get('country').valueChanges.distinctUntilChanged().subscribe(input => {
      this.displayCountrySuggestion = true;
      this.countriesSuggestion = [];
      this._autoCompleteService.get({keyword: input, type: 'countries'}).subscribe(res => {
        if (res.length === 0) {
          this.displayCountrySuggestion = false;
        } else {
          res.forEach((items) => {
            const valueIndex = this._countriesSuggestion.indexOf(items.name);
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

  toggleState() {
    this.state = 'inactive';
  }

  onSubmit() {
    // sending the form values to the parent.
    this._userFormSidebarService.setFormValue(this.userForm);
  }

  set state(value: string) {
    this._state = value;
  }

  get state(): string {
    return this._state;
  }

  set title(value: string) {
    this._title = value;
  }

  get title(): string {
    return this._title;
  }

  get userForm(): FormGroup {
    return this._userForm;
  }

  set countriesSuggestion(value: Array<string>) {
    this._countriesSuggestion = value;
  }

  get countriesSuggestion(): Array<string> {
    return this._countriesSuggestion;
  }

  set displayCountrySuggestion(value: boolean) {
    this._displayCountrySuggestion = value;
  }

  get displayCountrySuggestion(): boolean {
    return this._displayCountrySuggestion;
  }

}

