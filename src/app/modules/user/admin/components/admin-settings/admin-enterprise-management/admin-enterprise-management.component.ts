import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {EnterpriseService} from '../../../../../../services/enterprise/enterprise.service';
import {/*FormArray,*/ FormBuilder, FormGroup/*, Validators*/} from '@angular/forms';
import {SidebarInterface} from '../../../../../sidebars/interfaces/sidebar-interface';
import {Enterprise/*, Pattern*/} from '../../../../../../models/enterprise';
import {/*Observable,*/ combineLatest} from 'rxjs';
// import {Clearbit} from '../../../../../../models/clearbit';
// import {AutocompleteService} from '../../../../../../services/autocomplete/autocomplete.service';
/*import {DomSanitizer, SafeHtml} from '@angular/platform-browser';*/
import {Table} from '../../../../../table/models/table';
import {first} from 'rxjs/operators';
import {Config} from '../../../../../../models/config';
import {isPlatformBrowser} from '@angular/common';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {ShieldService} from '../../../../../../services/shield/shield.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';

@Component({
  templateUrl: './admin-enterprise-management.component.html',
  styleUrls: ['./admin-enterprise-management.component.scss']
})

export class AdminEnterpriseManagementComponent implements OnInit {

  // private _defaultLogoURI = 'https://res.cloudinary.com/umi/image/upload/app/companies-logo/no-image.png';

  private _searchForm: FormGroup = this._formBuilder.group({
    searchString: [''],
  });

  // private _newEnterpriseForm: FormGroup;

  // private _newEnterprise: Enterprise;

  // private _parentEntreprise: Enterprise;

  // private _enterpriseSidebarPatterns: Array<Pattern> = [];

  private _isSearching = false;

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  // private _uploadLogoModal = false;

  private _results = false;

  private _nothingFound = false;

  // private _editEnterpriseId: string = null;

  private _queryConfig: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"name":-1}'
  };

  private _resultTableConfiguration: Table = <Table>{};

  private _isLoading = true;

  private _selectedEnterprise: Enterprise = <Enterprise>{};

  private _isEditable = false;

  private _isSaving = false;

  private _shieldSortedList: Array<any> = [];

  get shieldSortedList(): Array<any> {
    return this._shieldSortedList;
  }

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _enterpriseService: EnterpriseService,
              private _formBuilder: FormBuilder,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _shieldService: ShieldService,
              private _notificationsService: NotificationsService,
              private _route: Router
              /*private _autoCompleteService: AutocompleteService,*/
              /*private _sanitizer: DomSanitizer*/) {
  }

  private _buildForm() {
    // New company form
    /*this._newEnterpriseForm = this._formBuilder.group({
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
    });*/
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._getShieldedPros();
    }
    this._buildForm();
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'enterprises'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'enterprises']);
    }
  }

  public doSearch() {
    this._isSearching = true;
    this._nothingFound = false;

    this._queryConfig['search'] = JSON.stringify({name: encodeURIComponent(this._searchForm.get('searchString').value)});
    this._getCompanies(this._queryConfig);
  }

  private _getCompanies(config: Config) {
    this._enterpriseService.get(null, config).pipe(first()).subscribe((enterprises: any) => {
      if (enterprises && enterprises.result && enterprises.result.length) {
        this._results = true;
        this._initTable(this.addShieldEmailsInTable(enterprises.result), enterprises._metadata.totalCount);
      } else {
        this._results = false;
        this._nothingFound = true;
      }
      this._isSearching = false;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._isSearching = false;
      console.error(err);
    });
  }

  private addShieldEmailsInTable(content: Array<any> = []) {
    this._shieldSortedList.map(item => {
      const element = content.find(el => el._id === item.company);
      if (element !== undefined) {
        element['shieldEmails'] = item.shieldEmails;
      } else {
        content.map(v => {
          v['shieldEmails'] = null;
        });
      }
    });
    return content;
  }

  private _initTable(content: Array<any> = [], total: number = -1) {
    this._resultTableConfiguration = {
      _selector: 'admin-enterprises-table',
      _title: 'Enterprises',
      _content: content,
      _total: total,
      _isTitle: true,
      _isSearchable: !!this.canAccess(['searchBy']),
      _isSelectable: this.canAccess(['delete']),
      _isPaginable: total > 10,
      _isAddParent: true,
      _isDeletable: this.canAccess(['delete']),
      _isNoMinHeight: total < 11,
      _isEditable: this.canAccess(['edit']),
      _clickIndex: this.canAccess(['edit']) || this.canAccess(['view']) ? 2 : null,
      _columns: [
        {
          _attrs: ['logo.uri'],
          _name: 'Logo',
          _type: 'PICTURE',
          _width: '120px',
          _isHidden: !this.canAccess(['tableColumns', 'logo'])
        },
        {
          _attrs: ['name'],
          _name: 'Name',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'name']),
          _isHidden: !this.canAccess(['tableColumns', 'name'])
        },
        {
          _attrs: ['topLevelDomain'],
          _name: 'Domain',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: true,
          _isHidden: !this.canAccess(['tableColumns', 'domain'])
        },
        {
          _attrs: ['patterns'],
          _name: 'Patterns',
          _type: 'LENGTH',
          _width: '120px',
          _isHidden: !this.canAccess(['tableColumns', 'patterns'])
        },
        {
          _attrs: ['enterpriseURL'],
          _name: 'Enterprise Url',
          _type: 'TEXT',
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'url'])
        },
        {
          _attrs: ['subsidiaries'],
          _name: 'Subsidiaries',
          _type: 'LENGTH',
          _width: '120px',
          _isHidden: !this.canAccess(['tableColumns', 'subsidiary'])
        },
        {
          _attrs: ['parentEnterprise'],
          _name: 'Parent Enterprise',
          _type: 'TEXT',
          _isSearchable: true,
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['emailSettings.goodEmails'],
          _name: 'Good emails',
          _type: 'NUMBER',
          _isSearchable: true,
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['emailSettings.bouncedEmails'],
          _name: 'Deduced emails',
          _type: 'NUMBER',
          _isSearchable: true,
          _width: '170px',
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['shieldEmails'],
          _name: 'Shield emails',
          _type: 'NUMBER',
          _isSearchable: true,
          _isSortable: false,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['industries'],
          _name: 'Industry',
          _type: 'LABEL-OBJECT-LIST',
          _isSearchable: true,
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['brands'],
          _name: 'Brand',
          _type: 'LABEL-OBJECT-LIST',
          _isSearchable: true,
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['enterpriseType'],
          _name: 'Type',
          _type: 'TEXT',
          _isSearchable: true,
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['geographicalZone'],
          _name: 'Geographical Zone',
          _type: 'GEO-ZONE-LIST',
          _isSearchable: true,
          _isSortable: true,
          _width: '190px',
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['enterpriseSize'],
          _name: 'Company size',
          _type: 'TEXT',
          _isSearchable: true,
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['valueChain'],
          _name: 'Value chain',
          _type: 'TEXT',
          _isSearchable: true,
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        }
      ]
    };
  }

  private _getShieldedPros() {
    this._shieldService.get(null, null)
      .pipe(first())
      .subscribe(response => {
        this.sortShieldList(response.result);
      }, err => {
        this._notificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
      });
  }

  private sortShieldList(shieldList: any[]) {
    shieldList.map((item) => {
      const element = this.shieldSortedList.find(el => el.company === item.professional.company);
      if (element) {
        element.shieldEmails += 1;
      } else {
        const newElement = {
          company: item.professional.company,
          shieldEmails: 1
        };
        this._shieldSortedList.push(newElement);
      }
    });
  }

  public openSidebar(event: any, type: 'CREATE' | 'EDIT') {
    switch (type) {

      case 'CREATE':
        // this._editEnterpriseId = null;
        // this._newEnterpriseForm.reset();
        this._isEditable = this.canAccess(['add']);
        this._isSaving = false;
        this._selectedEnterprise = <Enterprise>{};
        this._sidebarValue = {
          animate_state: 'active',
          title: 'Create Enterprise',
          type: 'CREATE'
        };
        break;

      case 'EDIT':
        this._isEditable = this.canAccess(['edit']);
        this._isSaving = false;
        // this._editEnterpriseId = event._id;
        // this._enterpriseSidebarPatterns = event.patterns;
        // this._newEnterpriseForm.patchValue(event);
        // this._newEnterpriseForm.get('patterns').reset('');
        // this._newEnterpriseForm.get('logo').reset(event.logo.uri);
        this._sidebarValue = {
          animate_state: 'active',
          title: this._isEditable ? 'Edit Enterprise' : 'Enterprise',
          type: 'EDIT'
        };
        this._selectedEnterprise = event;
        break;
    }
  }

  /*public saveEnterprise() {
    this._newEnterprise = {
      name: this._newEnterpriseForm.get('name').value,
      topLevelDomain: this._newEnterpriseForm.get('topLevelDomain').value,
      patterns: this._enterpriseSidebarPatterns,
      parentEnterprise: this._parentEntreprise ? this._parentEntreprise.id || null : null
    };
    Object.keys(this._newEnterpriseForm.controls).forEach(key => {
      if (this._newEnterpriseForm.get(key).value) {
        switch (key) {
          case 'patterns':
          case 'name':
          case 'topLevelDomain':
          case 'parentEnterprise':
            // NOOP
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
    const promise = !!this._editEnterpriseId ?
      this._enterpriseService.save(this._editEnterpriseId, this._newEnterprise) :
      this._enterpriseService.create(this._newEnterprise);

    promise.subscribe(result => {
        this._newEnterpriseForm.patchValue(result);
        const idx = this.resultTableConfiguration._content.findIndex((value) => {
            return value._id === result['_id'];
        });
        if (idx > -1) {
          this.resultTableConfiguration._content[idx] = result;
        }
      }, err => {
        console.error(err);
      });
  }*/

  public updateEnterprise(event: { enterprise: Enterprise, opType: string }) {
    switch (event.opType) {

      case 'CREATE':
        this._enterpriseService.create(event.enterprise).pipe(first()).subscribe((result) => {
          this._isSaving = false;
          this._translateNotificationsService.success('Success', 'The enterprise is created.');
          this._selectedEnterprise = <Enterprise>{};
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          this._isSaving = false;
          console.error(err);
        });
        break;

      case 'EDIT':
        console.log(event.enterprise);
        this._enterpriseService.save(this._selectedEnterprise._id, event.enterprise).pipe(first()).subscribe((result) => {
          this._isSaving = false;
          this._translateNotificationsService.success('Success', 'The enterprise is updated.');
          const idx = this._resultTableConfiguration._content.findIndex((value) => {
            return value._id === result['_id'];
          });
          if (idx > -1) {
            this._resultTableConfiguration._content[idx] = result;
          }
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          this._isSaving = false;
          console.error(err);
        });
        break;

    }
  }

  /*public companiesSuggestions = (searchString: string): Observable<Array<{name: string, domain: string, logo: string}>> => {
    return this._autoCompleteService.get({query: searchString, type: 'company'});
  }*/

  /*public enterpriseSuggestions = (searchString: string): Observable<Array<{name: string, logo: any, domain: string, _id: string}>> => {
    return this._autoCompleteService.get({query: searchString, type: 'enterprise'});
  }*/

  /*public selectCompany(c: string | Clearbit) {
    if (typeof c === 'object') {
      // Maybe there's a logo...
      this._newEnterpriseForm.get('name').reset(c.name);
      this._newEnterpriseForm.get('topLevelDomain').reset(c.domain);
      this._newEnterpriseForm.get('logo').reset(c.logo);
    } // If typeof c === string, leave the thing alone.
  }*/

  /*public selectEnterprise(c: string | Enterprise) {
    if (typeof c === 'object') {
      this._parentEntreprise = c;
    }
    this._newEnterpriseForm.get('parentEnterprise').reset('');
  }*/

  /*public autocompleteCompanyListFormatter = (data: any): SafeHtml => {
    return this._sanitizer.bypassSecurityTrustHtml(`<img style="vertical-align:middle;" src="${data.logo}" height="35" alt=" "/><span>${data.name}</span>`);
  }*/

  /*public autocompleteEnterpriseListFormatter = (data: any): SafeHtml => {
    return this._sanitizer.bypassSecurityTrustHtml(`<img style="vertical-align:middle;" src="${data.logo.uri}" height="35" alt=" "/><span>${data.name}</span>`);
  }*/

  /*public newPattern(event: Event) {
    event.preventDefault();
    if (this._newEnterpriseForm.get('patterns').value) {
      this._enterpriseSidebarPatterns.push({pattern: {expression: this._newEnterpriseForm.get('patterns').value}, avg: 0});
      this._newEnterpriseForm.get('patterns').reset('');
    }
  }*/

  public removeCompanies(event: any) {
    const requests = event.map((evt: any) => {
      return this._enterpriseService.remove(evt._id).pipe(first());
    });
    const combined = combineLatest(requests);
    combined.subscribe(latestValues => {
      latestValues.forEach(result => {
        console.log(result);
        // TODO see how I can update the table after deletion
        /*if (result && result['n'] > 0) {
          const idx = this.resultTableConfiguration._content.findIndex((value) => {
            return value._id === result['_id'];
          });
          if (idx > -1) {
            this.resultTableConfiguration._content.splice(idx, 1);
          }
        }*/
      });
    });
    /*this._enterpriseService.remove(event._id).pipe(first())
      .subscribe(result => {
        if (result) {
          const idx = this.resultTableConfiguration._content.findIndex((value) => {
            return value._id === result['_id'];
          });
          if (idx > -1) {
            this.resultTableConfiguration._content.splice(idx, 1);
          }
        }
      }, err => {
        console.error(err);
      });*/
  }

  /*public changeLogo(event: Event) {
    event.preventDefault();
    this._uploadLogoModal = true;
  }*/

  /*public removePattern(event: Event, index: number) {
    event.preventDefault();
    this._enterpriseSidebarPatterns.splice(index, 1);
  }*/

  /*public uploadImage(event: any) {
    if (event && event.url) {
      this._newEnterpriseForm.get('logo').reset(event.url);
    }
    this._uploadLogoModal = false;
  }
*/

  /*get logoUploadUri(): string {
    return `/media/companyLogo`;
  }*/

  get results(): boolean {
    return this._results;
  }

  get searchForm(): FormGroup {
    return this._searchForm;
  }

  /*get newEnterpriseForm(): FormGroup {
    return this._newEnterpriseForm;
  }*/

  get isSearching(): boolean {
    return this._isSearching;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  /*get patterns(): FormArray {
    return this._newEnterpriseForm.get('patterns') as FormArray;
  }*/

  /*get logoUrl(): string {
    let logoValue = this._newEnterpriseForm.get('logo').value;
    logoValue = logoValue && typeof logoValue === 'object' ?  logoValue.uri || this._defaultLogoURI : logoValue;
    return  logoValue || this._defaultLogoURI;
  }*/

  /*get uploadLogoModal(): boolean {
    return this._uploadLogoModal;
  }*/

  // set uploadLogoModal(value: boolean) {
  //   this._uploadLogoModal = value;
  // }

  get resultTableConfiguration(): Table {
    return this._resultTableConfiguration;
  }

  get queryConfig(): any {
    return this._queryConfig;
  }

  set queryConfig(value: any) {
    this._queryConfig = value;
    this._getCompanies(this._queryConfig);
  }

  get nothingFound(): boolean {
    return this._nothingFound;
  }

  /*get activePatterns(): Array<Pattern> {
    return this._enterpriseSidebarPatterns;
  }*/

  /*get parentEnterprise(): Enterprise {
    return this._parentEntreprise;
  }*/

  get isLoading(): boolean {
    return this._isLoading;
  }

  get selectedEnterprise(): Enterprise {
    return this._selectedEnterprise;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  navigateToEdit($event: any) {
    if ($event) {
      this._route.navigate(['/user/admin/settings/enterprises/bulkedit']);
    }
  }

  navigateToAddParent($event: any) {
    if ($event) {
      this._route.navigate(['/user/admin/settings/enterprises/addparent']);
    }
  }
}
