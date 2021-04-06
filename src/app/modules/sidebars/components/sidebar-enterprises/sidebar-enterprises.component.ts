import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Enterprise, Industry, Pattern} from '../../../../models/enterprise';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {AutocompleteService} from '../../../../services/autocomplete/autocomplete.service';
import {Clearbit} from '../../../../models/clearbit';
import {EnterpriseTypes, Industries} from '../../../../models/static-data/industries';
import {AutoSuggestionConfig} from '../../../utility/auto-suggestion/interface/auto-suggestion-config';
import {EnterpriseService} from '../../../../services/enterprise/enterprise.service';
import {HttpErrorResponse} from '@angular/common/http';

type Template = 'CREATE' | 'EDIT';

@Component({
  selector: 'app-sidebar-enterprises',
  templateUrl: './sidebar-enterprises.component.html',
  styleUrls: ['./sidebar-enterprises.component.scss']
})

export class SidebarEnterprisesComponent implements OnInit, OnDestroy, OnChanges {
  private _industries: Array<any> = Industries;
  private _enterpriseTypeList = EnterpriseTypes;

  get enterpriseTypeList(): string[] {
    return this._enterpriseTypeList;
  }

  get industries(): Array<any> {
    return this._industries;
  }

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this._buildForm();
    }
  }

  // provide this value when you want to update the existing enterprise, not while creating new one.
  // @Input() set enterprise(value: Enterprise) {
  //   this._enterprise = value;
  //   this._setValuesInForm(this._enterprise);
  //   this.setPatternConfig();
  // }
  @Input() enterprise: Enterprise = <Enterprise>{};

  private _newValueChains: Array<any> = [];
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

  private _parentEnterprise: Enterprise = <Enterprise>{};

  private _newBrands: Array<any> = [];

  private _newGeoZone: Array<any> = [];

  private _newSubsidiary: Array<any> = [];

  private _inputPatterns: Array<any> = [];

  private _inputBrands: Array<any> = [];

  private _inputGeoZone: Array<any> = [];

  private _isGeoConfig = false;

  private _isBrandConfig = false;

  private _isPatternConfig = false;

  private _newPatterns: Array<Pattern> = [];

  private _newIndustry: Array<Industry> = [];

  private _newEnterpriseType: Array<any> = [];

  private _industrySelectConfig: AutoSuggestionConfig = {
    minChars: 1,
    placeholder: 'Enter the industry',
    type: 'industry',
    identifier: ''
  };

  private _valueChainSelectConfig: AutoSuggestionConfig = {
    minChars: 1,
    placeholder: 'Enter the value chain',
    type: 'valueChain',
    identifier: ''
  };

  private _enterpriseSizeSelectConfig: AutoSuggestionConfig = {
    minChars: 0,
    placeholder: 'Enter the enterprise size',
    type: 'enterpriseSize',
    identifier: 'label',
    default: this._enterprise.enterpriseSize
  };

  private _enterpriseTypeSelectConfig: AutoSuggestionConfig = {
    minChars: 0,
    placeholder: 'Enter the enterprise type',
    type: 'enterpriseType',
    identifier: '',
    default: this._enterprise.enterpriseType
  };

  get enterpriseTypeSelectConfig(): AutoSuggestionConfig {
    return this._enterpriseTypeSelectConfig;
  }


  private initLists(enterprise: Enterprise) {
    this._inputPatterns = enterprise.patterns;
    this._inputGeoZone = enterprise.geographicalZone;
    this._inputBrands = enterprise.brands;
    this._newGeoZone = enterprise.geographicalZone;
    this._newBrands = enterprise.brands;
    this._newPatterns = enterprise.patterns;
    this._newValueChains = enterprise.valueChain;
    this._newIndustry = enterprise.industries;
    this._newSubsidiary = enterprise['subsidiariesName'];
    this._newEnterpriseType = [];
    this._newEnterpriseType.push(enterprise.enterpriseType);
  }


  get industrySelectConfig() {
    return this._industrySelectConfig;
  }


  get enterpriseSizeSelectConfig(): AutoSuggestionConfig {
    return this._enterpriseSizeSelectConfig;
  }

  get valueChainSelectConfig(): AutoSuggestionConfig {
    return this._valueChainSelectConfig;
  }

  constructor(private _formBuilder: FormBuilder,
              private _enterpriseService: EnterpriseService,
              private _autoCompleteService: AutocompleteService,
              private _domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this._form.valueChanges.pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
      this._saveChanges();
    });
  }


  private _setValuesInForm(enterprise: Enterprise) {
    this._isPatternConfig = false;
    this._isBrandConfig = false;
    this._isGeoConfig = false;
    if (JSON.stringify(enterprise) !== '{}') {
      this._form.get('name').setValue(enterprise.name);
      this._form.get('topLevelDomain').setValue(enterprise.topLevelDomain);
      this._form.get('enterpriseURL').setValue(enterprise.enterpriseURL);
      this._form.get('enterpriseType').setValue(enterprise.enterpriseType);
      this._form.get('enterpriseSize').setValue(enterprise.enterpriseSize);
      this._form.get('parentEnterprise').setValue(enterprise['parentEnterpriseName']);
      this.initLists(enterprise);
    } else {
      this._enterprise = <Enterprise>{};
      this._newGeoZone = [];
      this._newBrands = [];
      this._newPatterns = [];
      this._newValueChains = [];
      this._newIndustry = [];
      this._newSubsidiary = [];
      this._inputBrands = [];
      this._inputGeoZone = [];
      this._inputPatterns = [];
    }
    this._logo = enterprise.logo && enterprise.logo.uri || '';
    console.log(this._enterprise);
  }

  private _saveChanges() {
    this.isSaving = true;
  }


  get newGeoZone(): any {
    return this._newGeoZone;
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

  public selectEnterprise(type: string, c: string | Enterprise | any) {
    if (typeof c === 'object' && this.isEditable) {
      switch (type) {
        case 'subsidiary':
          this._newSubsidiary.push(c);
          this._form.get('subsidiaries').setValue('');
          break;
        case 'parent':
          this._parentEnterprise = c;
          this._form.get('parentEnterprise').setValue(this._parentEnterprise.name);
          break;
      }
      this._saveChanges();
    }
  }

  getSubsidiariesName(id: any) {
    this._enterpriseService.get(id, null).pipe(first()).subscribe(
      (enterprise: any) => {
        this._newSubsidiary.push({id: id, name: enterprise['name']});
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      });
  }

  public changeLogo(event: Event) {
    event.preventDefault();
    this._showModal = true;
  }

  getSubsidiaries() {
    const ids: string[] = [];
    this._newSubsidiary.map((sub) => {
      ids.push(sub['id']);
    });
    return ids;
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
        subsidiaries: this.getSubsidiaries(),
        valueChain: this._newValueChains
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
          case 'valueChain':
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
      console.log(_newEnterprise);
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

  public valueChainUpdate(event: any) {
    if (this.isEditable) {
      this._newValueChains.push(event);
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

  get patternConfig(): any {
    if (!this._isPatternConfig) {
      this._isPatternConfig = true;
      console.log(this._inputPatterns);
      return {
        placeholder: 'Enter the enterprise pattern',
        initialData: this._inputPatterns
      };
    }
  }

  get brandConfig(): any {
    if (!this._isBrandConfig) {
      this._isBrandConfig = true;
      return {
        placeholder: 'Enter the enterprise brand',
        initialData: this._inputBrands
      };
    }
  }

  get geoConfig(): any {
    if (!this._isGeoConfig) {
      this._isGeoConfig = true;
      return {
        placeholder: 'Enter the geographical zone',
        initialData: this._inputGeoZone
      };
    }
  }

  // get enterprise(): Enterprise {
  //   return this._enterprise;
  // }

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

  get newPatterns(): Array<Pattern> {
    return this._newPatterns;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }


  getValueSelected($event: any) {
    if ($event) {
      switch ($event.type) {
        case 'industry':
          if (this._newIndustry.length === 0 || this._newIndustry.find(item => item.label === $event.value) === undefined) {
            this.industryUpdate($event.value);
          }
          break;
        case 'valueChain':
          if (!this._newValueChains.toString().includes($event)) {
            this.valueChainUpdate($event.value);
          }
          break;
        case 'enterpriseSize':
          this._form.get('enterpriseSize').setValue($event.value);
          break;
        case 'enterpriseType':
          this._form.get('enterpriseType').setValue($event.value);
          this._newEnterpriseType[0] = $event.value;
          break;
      }
    }
  }

  deleteItem(type: any, answer: any) {
    switch (type) {
      case 'industry':
        this._newIndustry = this._newIndustry.filter(item => item.code !== answer.code);
        break;
      case 'valueChain':
        this._newValueChains = this._newValueChains.filter(item => item !== answer);
        break;
      case 'enterpriseType':
        this._form.get('enterpriseType').setValue('');
        this._newEnterpriseType = [];
        break;
      case 'subsidiaries':
        this._newSubsidiary = this._newValueChains.filter(item => item.name !== answer.name);
        break;
    }
  }

  getContext(type: string, list: any[]) {
    return {
      type: type,
      answerList: list
    };
  }


  get newValueChains(): Array<any> {
    return this._newValueChains;
  }


  get newEnterpriseType(): Array<Industry> {
    return this._newEnterpriseType;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['enterprise']) {
      this._enterprise = changes['enterprise'].currentValue;
      this._setValuesInForm(this._enterprise);
    }
  }
}
