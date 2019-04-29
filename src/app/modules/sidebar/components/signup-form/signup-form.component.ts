import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { environment } from '../../../../../environments/environment';
import { Clearbit } from '../../../../models/clearbit';
import { countries } from '../../../../models/static-data/country';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})

export class SignupFormComponent {

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this._buildForm();
      this._signupForm.reset();
    }
  }

  @Output() finalOutput = new EventEmitter<FormGroup>();

  private _signupForm: FormGroup;

  private _displayCountrySuggestion = false;

  private _countriesSuggestion: Array<string> = [];

  private _countries = countries;

  private _company: Clearbit;

  private _displayLoading: boolean = false;

  constructor(private _formBuilder: FormBuilder,
              private _autoCompleteService: AutocompleteService,
              private _sanitizer: DomSanitizer,
              private _translatesService: TranslateService) { }


  private _buildForm() {
    this._signupForm = this._formBuilder.group( {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      company: [{}],
      jobTitle: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(9)]],
      country: ['']
    });
  }


  public onSuggestCountries() {
    this._signupForm.get('country').valueChanges.pipe(distinctUntilChanged()).subscribe((input: any) => {
      this._displayCountrySuggestion = true;
      this._countriesSuggestion = [];
      this._autoCompleteService.get({query: input, type: 'countries'}).subscribe((res: any) => {
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


  public onValueSelect(value: string) {
    this._signupForm.get('country').setValue(value);
    this._displayCountrySuggestion = false;
  }


  public onContinue() {

    this._displayLoading = true;

    for (let code in this._countries) {
      if (this._countries[code] === this._signupForm.get('country').value) {
        this._signupForm.value['country'] = code;
      }
    }

    this._signupForm.get('company').reset(this._company);

    this.finalOutput.emit(this._signupForm);

  }


  public checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }


  public getTermsLink(): string {
    return this._translatesService.currentLang === 'en' ? 'https://www.umi.us/privacy/' : 'https://www.umi.us/fr/confidentialite/';
  }


  public companiesSuggestions = (searchString: string): Observable<Array<{name: string, domain: string, logo: string}>> => {
    return this._autoCompleteService.get({query: searchString, type: 'company'});
  };


  public autocompleteCompanyListFormatter = (data: any): SafeHtml => {
    return this._sanitizer.bypassSecurityTrustHtml(`<img src="${data.logo}" height="22" alt=" "/><span>${data.name}</span>`);
  };


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

  get countries(): any {
    return this._countries;
  }

  get company() {
    return this._company;
  }

  set company(value: Clearbit) {
    this._company = value;
  }

  get displayLoading(): boolean {
    return this._displayLoading;
  }

}
