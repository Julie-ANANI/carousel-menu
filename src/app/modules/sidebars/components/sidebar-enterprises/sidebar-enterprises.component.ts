import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Enterprise, Industry, Pattern} from '../../../../models/enterprise';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {AutocompleteService} from '../../../../services/autocomplete/autocomplete.service';
import {Clearbit} from '../../../../models/clearbit';
import {EnterpriseTypes, Industries} from '../../../../models/static-data/industries';
import {AutoSuggestionConfig} from '../../../utility/auto-suggestion/interface/auto-suggestion-config';

type Template = 'CREATE' | 'EDIT';

@Component({
  selector: 'app-sidebar-enterprises',
  templateUrl: './sidebar-enterprises.component.html',
  styleUrls: ['./sidebar-enterprises.component.scss']
})

export class SidebarEnterprisesComponent implements OnInit, OnDestroy {
  private _industries: Array<any> = Industries;
  private _enterpriseTypeList = EnterpriseTypes;


  get enterpriseTypeList(): string[] {
    return this._enterpriseTypeList;
  }

  get industries(): Array<any> {
    return this._industries;
  }

  private _companySize: Array<any> = [
    {
      label: 'TPE : 0-19 employés',
      value: 'TPE'
    },
    {
      label: 'PME : 20-249 employés',
      value: 'PME'
    }, {
      label: 'ETI : 250-5000 employés',
      value: 'ETI'
    }, {
      label: 'GE : >5000 employés',
      value: 'GE'
    }
  ];

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this._buildForm();
    }
  }

  // provide this value when you want to update the existing enterprise, not while creating new one.
  @Input() set enterprise(value: Enterprise) {
    if (JSON.stringify(value) !== '{}') {
      this._enterprise = value;
      this._isPatternConfig = false;
      this._isIndustryConfig = false;
      this._isGeoConfig = false;
      this._isBrandConfig = false;
      this._isSubConfig = false;
      this._form.get('name').setValue(this._enterprise.name);
      this._form.get('topLevelDomain').setValue(this._enterprise.topLevelDomain);
      this._form.get('enterpriseURL').setValue(this._enterprise.enterpriseURL);
      this._form.get('enterpriseType').setValue(this._enterprise.enterpriseType);
      this._form.get('enterpriseSize').setValue(this._enterprise.enterpriseSize);
      this._geoZoneInputList = this._enterprise.geographicalZone;
      this._brandInputList = this._enterprise.brands;
      this._industryInputList = this._enterprise.industries;
      this._patternsInputList = this._enterprise.patterns;
      this._newSubsidiary = this._enterprise.subsidiaries;
    } else {
      this._enterprise = <Enterprise>{};
    }

    this._logo = this._enterprise.logo && this._enterprise.logo.uri || '';
  }

  @Input() isEditable = false;

  @Input() type: Template = 'EDIT';

  @Input() isSaving = false;

  @Output() finalOutput: EventEmitter<{ enterprise: Enterprise, opType: string }> =
    new EventEmitter<{ enterprise: Enterprise, opType: string }>();

  private _enterprise: Enterprise = <Enterprise>{};

  private _form: FormGroup;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _defaultLogoURI = 'https://res.cloudinary.com/umi/image/upload/app/companies-logo/no-image.png';

  private _logo = '';

  private _showModal = false;

  private _isSubConfig = false;

  private _parentEnterprise: Enterprise = <Enterprise>{};

  private _patternsInputList: Array<any> = [];

  private _industryInputList: Array<any> = [];

  private _brandInputList: Array<any> = [];

  private _newBrands: Array<any> = [];

  private _newGeoZone: Array<any> = [];

  private _geoZoneInputList: Array<any> = [];

  private _subsidiaryInputList: Array<any> = [];

  private _newSubsidiary: Array<any> = [];

  private _newPatterns: Array<Pattern> = [];

  private _newIndustry: Array<Industry> = [];

  private _isBrandConfig = false;
  private _isGeoConfig = false;
  private _isIndustryConfig = false;
  private _isPatternConfig = false;
  private _industrySelectConfig: AutoSuggestionConfig = {
    minChars: 3,
    placeholder: 'Enter the industry',
    type: 'industry',
    identifier: ''
  };


  get industrySelectConfig() {
    return this._industrySelectConfig;
  }

  constructor(private _formBuilder: FormBuilder,
              private _autoCompleteService: AutocompleteService,
              private _domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this._form.valueChanges.pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
      this._saveChanges();
    });
  }

  private _saveChanges() {
    this.isSaving = true;
  }


  get newGeoZone(): any {
    return this._newGeoZone;
  }

  get geoZoneInputList(): any {
    return this._geoZoneInputList;
  }

  get newIndustry(): Array<any> {
    return this._newIndustry;
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
      geographicalZone: [null],
      enterpriseSize: [null],
      valueChain: [null]
    });
  }


  get brandInputList(): any {
    return this._brandInputList;
  }

  get newBrands(): any {
    return this._newBrands;
  }


  get newSubsidiary(): Array<any> {
    return this._newSubsidiary;
  }

  public autocompleteCompanyListFormatter = (data: any): SafeHtml => {
    return this._domSanitizer.bypassSecurityTrustHtml(
      `<img src="${data._logo}" height="22" alt=" "/><span>${data.name}</span>`
    );
  };

  public autocompleteEnterpriseListFormatter = (data: any): SafeHtml => {
    return this._domSanitizer.bypassSecurityTrustHtml(
      `<img src="${data.logo.uri}" height="22" alt=" "/><span>${data.name}</span>`
    );
  };

  public companiesSuggestions = (searchString: string): Observable<Array<{ name: string, domain: string, logo: string }>> => {
    return this._autoCompleteService.get({query: searchString, type: 'company'});
  };

  public enterpriseSuggestions = (searchString: string): Observable<Array<{ name: string, logo: any, domain: string, _id: string }>> => {
    return this._autoCompleteService.get({query: searchString, type: 'enterprise'});
  };

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
      this._form.get('parentEnterprise').setValue(this._parentEnterprise.name);
      this._saveChanges();
    }
  }

  public changeLogo(event: Event) {
    event.preventDefault();
    this._showModal = true;
  }

  public onSubmit() {
    if (this.isEditable && this._form.valid) {
      this.isSaving = false;

      const _newEnterprise: Enterprise = {
        name: this._form.get('name').value,
        topLevelDomain: this._form.get('topLevelDomain').value,
        patterns: this.newPatterns,
        parentEnterprise: this._parentEnterprise ? this._parentEnterprise['id'] : null,
        industries: this.newIndustry,
        brands: this.newBrands,
        geographicalZone: this.newGeoZone,
        subsidiaries: this.newSubsidiary
      };

      Object.keys(this._form.controls).forEach(key => {
        switch (key) {
          case 'patterns':
          case 'name':
          case 'topLevelDomain':
          case 'parentEnterprise':
          case 'industries':
          case 'brands':
          case 'geographicalZone':
          case 'subsidiaries':
            // NOOP
            break;
          case 'logo':
            _newEnterprise[key] = {
              'uri': this._logo === '' ? this.defaultLogoURI : this._logo,
              'alt': this._form.get('name').value
            };
            break;

          default:
            if (this._form.get(key).value) {
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

  public patternsUpdate(event: { value: Array<any> }) {
    if (this.isEditable) {
      this._newPatterns = [];
      this._newPatterns = event.value.map((text) => {
        return {expression: text.expression || text.text, avg: 0};
      });
      this._saveChanges();
    }
  }

  public industryUpdate(event: any) {
    if (this.isEditable) {
      this._newIndustry.push({label: event, code: event});
      this._saveChanges();
    }
  }

  public brandUpdate(event: { value: Array<any> }) {
    if (this.isEditable) {
      this._newBrands = event.value.map((text) => {
        return {label: text.text || text.label, url: ''};
      });
      this._saveChanges();
    }
  }

  public geoZoneUpdate(event: { value: Array<any> }) {
    if (this.isEditable) {
      this._newGeoZone = [];
      this._newGeoZone = event.value.map((text) => {
        return {scope: 'country', name: text.text || text.name};
      });
      this._saveChanges();
    }
  }

  public subsidiaryUpdate(event: { value: Array<any> }) {
    if (this.isEditable) {
      this._newSubsidiary = [];
      this._newSubsidiary = event.value.map((text) => {
        return text['id'];
      });
      this._saveChanges();
    }
  }

  get industryInputList(): Array<any> {
    return this._industryInputList;
  }

  set industryInputList(value: Array<any>) {
    this._industryInputList = value;
  }

  get patternConfig(): any {
    if (JSON.stringify(this.enterprise) !== '{}' && !this._isPatternConfig) {
      this._isPatternConfig = true;
      return {
        placeholder: 'Enter the enterprise pattern',
        initialData: this._patternsInputList
      };
    }
  }


  get companySize(): Array<any> {
    return this._companySize;
  }

  get subConfig(): any {
    if (JSON.stringify(this.enterprise) !== '{}' && !this._isSubConfig) {
      this._isSubConfig = true;
      return {
        placeholder: 'Enter the enterprise subsidiary',
        initialData: this._subsidiaryInputList
      };
    }
  }

  get industryConfig(): any {
    if (JSON.stringify(this.enterprise) !== '{}' && !this._isIndustryConfig) {
      this._isIndustryConfig = true;
      return {
        placeholder: 'Enter the enterprise industry',
        initialData: this._industryInputList
      };
    }
  }

  get brandConfig(): any {
    if (JSON.stringify(this.enterprise) !== '{}' && !this._isBrandConfig) {
      this._isBrandConfig = true;
      return {
        placeholder: 'Enter the enterprise brand',
        initialData: this._brandInputList
      };
    }
  }

  get geoConfig(): any {
    if (JSON.stringify(this.enterprise) !== '{}' && !this._isGeoConfig) {
      this._isGeoConfig = true;
      return {
        placeholder: 'Enter the geographical zone',
        initialData: this._geoZoneInputList
      };
    }
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

  test() {
    console.log(444);
  }

  getIndustrySelected($event: any) {
    if ($event && !this.industryInputList.toString().includes($event)) {
      this.industryUpdate($event);
    }
    console.log(this.newIndustry);
  }
}
