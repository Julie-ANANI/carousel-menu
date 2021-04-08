import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Enterprise, Industry, Pattern} from '../../../../models/enterprise';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {AutocompleteService} from '../../../../services/autocomplete/autocomplete.service';
import {Clearbit} from '../../../../models/clearbit';
import {EnterpriseTypes, Industries} from '../../../../models/static-data/enterprise';
import {AutoSuggestionConfig} from '../../../utility/auto-suggestion/interface/auto-suggestion-config';
import {EnterpriseService} from '../../../../services/enterprise/enterprise.service';
import {HttpErrorResponse} from '@angular/common/http';

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

  @Input() set enterprise(value: Enterprise) {
    console.log(value);
    if (JSON.stringify(value) !== '{}') {
      this._enterprise = value;
    } else {
      this._enterprise = <Enterprise>{};
    }
    this._logo = this._enterprise.logo && this._enterprise.logo.uri || '';
  }

  @Input() set sidebarState(value: string) {
    if (value === undefined) {
      this._buildForm();
    }
    if (value === 'active') {
      this.fillTheForm();
      this.initAutoSuggestionConfig();
    }
  }

// provide this value when you want to update the existing enterprise, not while creating new one.

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

  private _subsidiaryNames: Array<any> = [];

  private _inputPatterns: Array<any> = [];

  private _inputBrands: Array<any> = [];

  private _inputGeoZone: Array<any> = [];

  private _isGeoConfig = false;

  private _isBrandConfig = false;

  private _isPatternConfig = false;

  private _newPatterns: Array<Pattern> = [];

  private _newIndustry: Array<Industry> = [];

  private _newEnterpriseType: Array<any> = [];

  private _isShowSyntax = false;

  private _industrySelectConfig: AutoSuggestionConfig = <AutoSuggestionConfig>{};

  private _valueChainSelectConfig: AutoSuggestionConfig = <AutoSuggestionConfig>{};

  private _enterpriseSizeSelectConfig: AutoSuggestionConfig = <AutoSuggestionConfig>{};

  private _enterpriseTypeSelectConfig: AutoSuggestionConfig = <AutoSuggestionConfig>{};

  get enterpriseTypeSelectConfig(): AutoSuggestionConfig {
    return this._enterpriseTypeSelectConfig;
  }

  private fillTheForm() {
    this._form.get('name').setValue(this._enterprise.name);
    this._form.get('topLevelDomain').setValue(this._enterprise.topLevelDomain);
    this._form.get('enterpriseURL').setValue(this._enterprise.enterpriseURL);
    this._form.get('enterpriseSize').setValue(this._enterprise.enterpriseSize);
    this._form.get('parentEnterprise').setValue(this._enterprise.parentEnterpriseName || '');
    this._newEnterpriseType = [];
    this._newEnterpriseType.push(this._enterprise.enterpriseType);
    this._newIndustry = this._enterprise.industries || [];
    this._newValueChains = this._enterprise.valueChain || [];
    this._newBrands = this._enterprise.brands || [];
    this._newPatterns = this._enterprise.patterns || [];
    this._newGeoZone = this._enterprise.geographicalZone || [];
    this._newSubsidiary = this._enterprise.subsidiariesName || [];
    this._inputPatterns = this._enterprise.patterns || [];
    this._inputGeoZone = this._enterprise.geographicalZone || [];
    this._inputBrands = this._enterprise.brands || [];
    this._isGeoConfig = false;
    this._isBrandConfig = false;
    this._isPatternConfig = false;
  }

  private initAutoSuggestionConfig() {
    this._industrySelectConfig = {
      minChars: 1,
      placeholder: 'Enter the industry',
      type: 'industry',
      identifier: ''
    };

    this._valueChainSelectConfig = {
      minChars: 1,
      placeholder: 'Enter the value chain',
      type: 'valueChain',
      identifier: ''
    };

    this._enterpriseSizeSelectConfig = {
      minChars: 0,
      placeholder: 'Enter the enterprise size',
      type: 'enterpriseSize',
      identifier: 'label',
    };

    this._enterpriseTypeSelectConfig = {
      minChars: 0,
      placeholder: 'Enter the enterprise type',
      type: 'enterpriseType',
      identifier: '',
    };

  }


  get subsidiaryNames(): Array<any> {
    return this._subsidiaryNames;
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
      event.value.map((text) => {
        this._newPatterns.push({expression: text.expression || text.text, avg: 0});
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
      this._newBrands = [];
      event.value.map((text) => {
        this._newBrands.push({label: text.text || text.label, url: ''});
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
        case 'patterns':
          if (this._newPatterns.length === 0 || this._newPatterns.find(item => item.expression === $event.value) === undefined) {
            this.patternsUpdate($event.value);
          }
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
        this._newSubsidiary = this._newSubsidiary.filter(item => item.name !== answer.name);
        break;
      case 'patterns':
        this._newPatterns = this._newPatterns.filter(item => item.expression !== answer.expression);
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

  get isShowSyntax(): boolean {
    return this._isShowSyntax;
  }

  get newEnterpriseType(): Array<Industry> {
    return this._newEnterpriseType;
  }

  changeShowSyntax() {
    this._isShowSyntax = !this.isShowSyntax;
  }
}
