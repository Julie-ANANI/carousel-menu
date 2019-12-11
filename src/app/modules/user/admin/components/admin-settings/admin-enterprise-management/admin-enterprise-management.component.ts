import { Component, OnInit } from '@angular/core';
import {EnterpriseService} from "../../../../../../services/enterprise/enterprise.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SidebarInterface} from "../../../../../sidebars/interfaces/sidebar-interface";
import {Enterprise, Pattern} from "../../../../../../models/enterprise";
import {Observable} from "rxjs";
import {Clearbit} from "../../../../../../models/clearbit";
import {AutocompleteService} from "../../../../../../services/autocomplete/autocomplete.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Table} from "../../../../../table/models/table";


@Component({
  selector: 'app-admin-enterprise-management',
  templateUrl: './admin-enterprise-management.component.html',
  styleUrls: ['./admin-enterprise-management.component.scss']
})
export class AdminEnterpriseManagementComponent implements OnInit {

  private _defaultLogoURI = 'https://res.cloudinary.com/umi/image/upload/app/companies-logo/no-image.png';

  private _searchForm: FormGroup;
  private _newEnterpriseForm: FormGroup;

  private _newEnterprise: Enterprise;
  private _parentEntreprise: Enterprise;
  private _enterpriseSidebarPatterns: Array<Pattern> = [];
  private _displayLoading: boolean = false;
  private _sidebarValue: SidebarInterface = {};
  private _uploadLogoModal: boolean = false;

  private _results: boolean = false;
  private _nothingFound: boolean = false;

  private _editEnterpriseId: string = null;

  private _queryConfig: any = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _resultTableConfiguration: Table = {
    _selector: 'admin-enterprises-table',
    _title: 'ENTERPRISE.TITLE',
    _content: [],
    _total: 0,
    _isTitle: true,
    _isSearchable: false,
    _isSelectable: true,
    _isEditable: true,
    _isPaginable: true,
    _clickIndex: 2,
    _columns: [
      {_attrs: ['logo.uri'], _name: 'ENTERPRISE.LOGO', _type: 'PICTURE', _isSearchable: false},
      {_attrs: ['name'], _name: 'ENTERPRISE.NAME', _type: 'TEXT', _isSearchable: true},
      {_attrs: ['topLevelDomain'], _name: 'ENTERPRISE.TOP_LEVEL_DOMAIN', _type: 'TEXT', _isSortable: true},
      {_attrs: ['patterns'], _name: 'ENTERPRISE.PATTERNS', _type: 'LENGTH', _isSearchable: false},
      {_attrs: ['enterpriseURL'], _name: 'ENTERPRISE.ENTERPRISE_URL', _type: 'TEXT', _isSortable: true},
      {_attrs: ['subsidiaries'], _name: 'ENTERPRISE.SUBSIDIARIES', _type: 'LENGTH', _isSearchable: false},
      {_attrs: ['parentEnterprise'], _name: 'ENTERPRISE.PARENT_ENTERPRISE', _type: 'TEXT', _isSearchable: true}
    ]
  };

  constructor(private _enterpriseService: EnterpriseService,
              private _formBuilder: FormBuilder,
              private _autoCompleteService: AutocompleteService,
              private _sanitizer: DomSanitizer,) {
  }

  private _buildForm() {
    // Search form
    this._searchForm = this._formBuilder.group( {
      searchString: [''],
    });

    // New company form
    this._newEnterpriseForm = this._formBuilder.group({
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


  ngOnInit(): void {
    this._buildForm();
  }

  public doSearch() {
    this._displayLoading = true;
    this._nothingFound = false;
    this._queryConfig['search'] = JSON.stringify({name: encodeURIComponent(this._searchForm.get('searchString').value)});
    // This is a search because the fucking indexes are not working grrrr
    this._enterpriseService.get(null, this._queryConfig)
      .subscribe( (enterprises:any) => {
        if(enterprises && enterprises.result && enterprises.result.length) {
          this._resultTableConfiguration._content = enterprises.result;
          this._resultTableConfiguration._total = enterprises._metadata.totalCount;
          this._results = true;
        } else {
          this._results = false;
          this._nothingFound = true;
        }
        this._displayLoading = false;
      }, (err: any)=> {
        console.error(err);
        this._displayLoading = false;
      });
  }

  public openSidebar(event: any, type: string) {
    switch(type) {
      case 'create':
        event.preventDefault();
        this._editEnterpriseId = null;
        this._newEnterpriseForm.reset();
        this._sidebarValue = {
          animate_state: 'active',
          title: 'Add a new enterprise',
          type: 'enterprise'
        };
        break;
      case 'edit':
        this._editEnterpriseId = event._id;
        this._enterpriseSidebarPatterns = event.patterns;
        this._newEnterpriseForm.patchValue(event);
        this._newEnterpriseForm.get('patterns').reset('');
        this._newEnterpriseForm.get('logo').reset(event.logo.uri);
        this._sidebarValue = {
          animate_state: 'active',
          title: 'Edit enterprise',
          type: 'enterprise'
        };
        break;
      default:
        //NOOP
    }
  }

  public saveEnterprise() {
    this._newEnterprise = {
      name: this._newEnterpriseForm.get('name').value,
      topLevelDomain: this._newEnterpriseForm.get('topLevelDomain').value,
      patterns: this._enterpriseSidebarPatterns,
      parentEnterprise: this._parentEntreprise.id || null
    };
    Object.keys(this._newEnterpriseForm.controls).forEach(key => {
      if(this._newEnterpriseForm.get(key).value) {
        switch(key) {
          case 'patterns':
          case 'name':
          case 'topLevelDomain':
          case 'parentEnterprise':
            //NOOP
            break;
          case 'logo':
            this._newEnterprise[key] = {
              'uri': this._newEnterpriseForm.get('logo').value || this._defaultLogoURI,
              'alt': this._newEnterpriseForm.get('name').value
            };
            break;
          default:
            this._newEnterprise[key] = this._newEnterpriseForm.get(key).value;
        }
      }
    });
    let promise = !!this._editEnterpriseId ?
      this._enterpriseService.save(this._editEnterpriseId, this._newEnterprise) :
      this._enterpriseService.create(this._newEnterprise);

    promise.subscribe(result => {
        console.log(result);
      }, err=> {
        console.error(err);
      });
  }

  public companiesSuggestions = (searchString: string): Observable<Array<{name: string, domain: string, logo: string}>> => {
    return this._autoCompleteService.get({query: searchString, type: 'company'});
  };

  public enterpriseSuggestions = (searchString: string): Observable<Array<{name: string, logo: any, domain: string, _id: string}>> => {
    return this._autoCompleteService.get({query: searchString, type: 'enterprise'});
  };

  public selectCompany(c: string | Clearbit) {
    if(typeof c === 'object') {
      // Maybe there's a logo...
      this._newEnterpriseForm.get('name').reset(c.name);
      this._newEnterpriseForm.get('topLevelDomain').reset(c.domain);
      this._newEnterpriseForm.get('logo').reset(c.logo);
    } // If typeof c === string, leave the thing alone.
  }

  public selectEnterprise(c: string | Enterprise) {
    if(typeof c === 'object') {
      this._parentEntreprise = c;
    }
    this._newEnterpriseForm.get('parentEnterprise').reset('');
  }

  public autocompleteCompanyListFormatter = (data: any): SafeHtml => {
    return this._sanitizer.bypassSecurityTrustHtml(`<img style="vertical-align:middle;" src="${data.logo}" height="35" alt=" "/><span>${data.name}</span>`);
  };

  public autocompleteEnterpriseListFormatter = (data: any): SafeHtml => {
    return this._sanitizer.bypassSecurityTrustHtml(`<img style="vertical-align:middle;" src="${data.logo.uri}" height="35" alt=" "/><span>${data.name}</span>`);
  };

  public newPattern(event: Event) {
    event.preventDefault();
    if(this._newEnterpriseForm.get('patterns').value) {
      this._enterpriseSidebarPatterns.push({pattern: {expression: this._newEnterpriseForm.get('patterns').value}, avg:0});
      this._newEnterpriseForm.get('patterns').reset('');
    }
  }

  public changeLogo(event: Event) {
    event.preventDefault();
    this._uploadLogoModal = true;
  }

  public removePattern(event: Event, index: number) {
    event.preventDefault();
    this._enterpriseSidebarPatterns.splice(index, 1);
  }

  public uploadImage(event: Event) {
    console.log(event);
  }

  get logoUploadUri(): string {

    //'/innovation/'+innovation._id+'/innovationCard/'+innovationCard._id+'/media/image'
    return `/enterprise....`;
  }

  get results(): boolean {
    return this._results;
  }

  get searchForm(): FormGroup {
    return this._searchForm;
  }

  get newEnterpriseForm(): FormGroup {
    return this._newEnterpriseForm;
  }

  get displayLoading(): boolean {
    return this._displayLoading;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get patterns(): FormArray {
    return this._newEnterpriseForm.get('patterns') as FormArray;
  }

  get logoUrl(): string {
    let logoValue = this._newEnterpriseForm.get('logo').value;
    logoValue = logoValue && typeof logoValue === 'object' ?  logoValue.uri || this._defaultLogoURI : logoValue;
    return  logoValue || this._defaultLogoURI;
  }

  get uploadLogoModal(): boolean {
    return this._uploadLogoModal;
  }

  set uploadLogoModal(value: boolean) {
    this._uploadLogoModal = value;
  }

  get resultTableConfiguration(): Table {
    return this._resultTableConfiguration;
  }

  get queryConfig(): any {
    return this._queryConfig;
  }

  set queryConfig(value: any) {
    this._queryConfig = value;
  }

  get nothingFound(): boolean {
    return this._nothingFound;
  }

  get activePatterns(): Array<Pattern> {
    return this._enterpriseSidebarPatterns;
  }

  get parentEnterprise(): Enterprise {
    return this._parentEntreprise;
  }
}
