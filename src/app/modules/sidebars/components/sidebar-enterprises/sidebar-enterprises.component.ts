import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Enterprise, Pattern} from '../../../../models/enterprise';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {AutocompleteService} from '../../../../services/autocomplete/autocomplete.service';
import {Clearbit} from '../../../../models/clearbit';

type Template = 'CREATE' | 'EDIT';

@Component({
  selector: 'app-sidebar-enterprises',
  templateUrl: './sidebar-enterprises.component.html',
  styleUrls: ['./sidebar-enterprises.component.scss']
})

export class SidebarEnterprisesComponent implements OnInit, OnDestroy {

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this._patternsInputList = [];
      this._newPatterns = [];
      this._buildForm();
      this._form.reset();
    }
  }

  @Input() isEditable = false;

  // provide this value when you want to update the existing enterprise, not while creating new one.
  @Input() set enterprise(value: Enterprise) {
    if (!!value) {
      this._enterprise = value;
      this._form.patchValue(this._enterprise);
      this._form.get('patterns').reset('');
    } else {
      this._enterprise = <Enterprise>{};
    }

    this._logo = this._enterprise.logo && this._enterprise.logo.uri || '';
  }

  @Input() type: Template = 'EDIT';

  @Input() isSaving = false;

  @Output() finalOutput: EventEmitter<{enterprise: Enterprise, opType: string}> =
    new EventEmitter<{enterprise: Enterprise, opType: string}>();

  private _enterprise: Enterprise = <Enterprise>{};

  private _form: FormGroup;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _defaultLogoURI = 'https://res.cloudinary.com/umi/image/upload/app/companies-logo/no-image.png';

  private _logo = '';

  private _showModal = false;

  private _parentEnterprise: Enterprise = <Enterprise>{};

  private _patternsInputList: Array<any> = [];

  private _newPatterns: Array<Pattern> = [];

  constructor(private _formBuilder: FormBuilder,
              private _autoCompleteService: AutocompleteService,
              private _domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this._form.valueChanges.pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
      this._saveChanges();
    });
  }

  private _saveChanges() {
    this.isSaving = true;
  }

  private _buildForm() {
    this._form = this._formBuilder.group({
      name: [null, [Validators.required]],
      topLevelDomain: [null, [Validators.required]],
      enterpriseURL: [null],
      logo: [null],
      subsidiaries: [null],
      parentEnterprise: [null],
      patterns: [null],
      enterpriseType: [null],
      industries: [null],
      brands: [null],
      geographicalZone: [null]
    });
  }

  public autocompleteCompanyListFormatter = (data: any): SafeHtml => {
    return this._domSanitizer.bypassSecurityTrustHtml(
      `<img src="${data._logo}" height="22" alt=" "/><span>${data.name}</span>`
    );
  }

  public autocompleteEnterpriseListFormatter = (data: any): SafeHtml => {
    return this._domSanitizer.bypassSecurityTrustHtml(
      `<img src="${data.logo.uri}" height="22" alt=" "/><span>${data.name}</span>`
    );
  }

  public companiesSuggestions = (searchString: string): Observable<Array<{name: string, domain: string, logo: string}>> => {
    return this._autoCompleteService.get({query: searchString, type: 'company'});
  }

  public enterpriseSuggestions = (searchString: string): Observable<Array<{name: string, logo: any, domain: string, _id: string}>> => {
    return this._autoCompleteService.get({query: searchString, type: 'enterprise'});
  }

  public selectCompany(c: string | Clearbit | any) {
    if (typeof c === 'object' && this.isEditable) {
      // Maybe there's a logo...
      this._form.get('name').setValue(c.name);
      this._form.get('topLevelDomain').setValue(c.domain);
      this._logo = c._logo;
      this._saveChanges();
      // this._form.get('logo').reset(c._logo);
    } // If typeof c === string, leave the thing alone.
  }

  public selectEnterprise(c: string | Enterprise | any) {
    if (typeof c === 'object' && this.isEditable) {
      this._parentEnterprise = c;
      this._saveChanges();
    }
    this._form.get('parentEnterprise').reset('');
  }

  public changeLogo(event: Event) {
    event.preventDefault();
    this._showModal = true;
  }

  public onSubmit() {
    if (this.isEditable && this.isSaving && this._form.valid) {
      this.isSaving = false;

      let _newEnterprise: Enterprise = {
        name: this._form.get('name').value,
        topLevelDomain: this._form.get('topLevelDomain').value,
        patterns: this._enterprise.patterns && this._enterprise.patterns.length ?
        this._enterprise.patterns.concat(this._newPatterns) : this._newPatterns,
        parentEnterprise: this._parentEnterprise ? this._parentEnterprise._id || null : null
      };

      Object.keys(this._form.controls).forEach(key => {
        if (this._form.get(key).value) {
          switch (key) {

            case 'patterns':
            case 'name':
            case 'topLevelDomain':
            case 'parentEnterprise':
              // NOOP
              break;

              case 'logo':
              _newEnterprise[key] = {
                'uri': this._logo || this._defaultLogoURI,
                'alt': this._form.get('name').value
              };
              break;

            default:
              _newEnterprise[key] = this._form.get(key).value;
          }
        }
      });

      this.finalOutput.emit({enterprise: _newEnterprise, opType: this.type});

    }
  }

  public uploadImage(event: any) {
    if (event && event.url) {
      this._logo = event.url;
      this._saveChanges();
    }
    this._showModal = false;
  }

  public patternsUpdate(event: {value: Array<any>}) {
    if (this.isEditable) {
      this._newPatterns = event.value.map((text) => {
        return {pattern: {expression: text.text}, avg: 0};
      });
      this._saveChanges();
    }
  }

  get patternConfig(): any {
    return {
      placeholder: 'Enter the enterprise pattern',
      initialData: this._patternsInputList
    };
  }

  get enterprise(): Enterprise {
    return this._enterprise;
  }

  get form(): FormGroup {
    return this._form;
  }

  get defaultLogoURI(): string {
    return this._defaultLogoURI;
  }

  get logo(): string {
    return this._logo;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get parentEnterprise(): Enterprise {
    return this._parentEnterprise;
  }

  get patternsInputList(): Array<any> {
    return this._patternsInputList;
  }

  get newPatterns(): Array<Pattern> {
    return this._newPatterns;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
