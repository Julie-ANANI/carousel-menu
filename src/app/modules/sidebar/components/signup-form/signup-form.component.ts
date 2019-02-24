import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})

export class SignupFormComponent {

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this.buildForm();
      this._signupForm.reset();
    }
  }

  @Output() finalOutput = new EventEmitter<FormGroup>();

  private _signupForm: FormGroup;

  private _displayCountrySuggestion = false;

  private _countriesSuggestion: Array<string> = [];

  constructor(private formBuilder: FormBuilder,
              private autoCompleteService: AutocompleteService) { }


  private buildForm() {
    this._signupForm = this.formBuilder.group( {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(9)]],
      country: ['', [Validators.required]]
    });
  }


  onSuggestCountries() {
    this._signupForm.get('country').valueChanges.pipe(distinctUntilChanged()).subscribe((input: any) => {
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
    this._signupForm.get('country').setValue(value);
    this._displayCountrySuggestion = false;
  }


  onContinue() {
    this.finalOutput.emit(this._signupForm);
  }


  checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get companyName(): string {
    return environment.companyShortName;
  }

  get signupForm(): FormGroup {
    return this._signupForm;
  }

  get displayCountrySuggestion(): boolean {
    return this._displayCountrySuggestion;
  }

  get countriesSuggestion(): Array<string> {
    return this._countriesSuggestion;
  }

}
