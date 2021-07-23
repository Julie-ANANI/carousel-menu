import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {EnterpriseService} from '../../../../../../services/enterprise/enterprise.service';
import {
  /*FormArray,*/ FormBuilder,
  FormGroup /*, Validators*/,
} from '@angular/forms';
import {SidebarInterface} from '../../../../../sidebars/interfaces/sidebar-interface';
import {Enterprise /*, Pattern*/} from '../../../../../../models/enterprise';
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
import {Router} from '@angular/router';

@Component({
  templateUrl: './admin-enterprise-management.component.html',
  styleUrls: ['./admin-enterprise-management.component.scss'],
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

  private _companiesSelected: Array<any> = [];

  // private _editEnterpriseId: string = null;

  private _queryConfig: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"name":-1}',
  };

  private _resultTableConfiguration: Table = <Table>{};

  private _isLoading = true;

  private _selectedEnterprise: Enterprise = <Enterprise>{};

  private _isEditable = false;

  private _isSaving = false;

  private _customButtons: Array<{
    _label: string;
    _icon?: string;
    _colorClass?: string;
    _iconSize?: string;
    _isHidden?: boolean;
  }> = [
    {
      _label: 'Add parent',
      _icon: 'icon-left text-sm icon icon-plus',
      _isHidden: !this.canAccess(['addParent', 'view'])
    },
    {
      _label: 'Bulk edit',
      _icon: 'icon-left text-sm icon icon-edit',
      _isHidden: !this.canAccess(['bulkEdit', 'view'])
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) protected _platformId: Object,
    private _enterpriseService: EnterpriseService,
    private _formBuilder: FormBuilder,
    private _rolesFrontService: RolesFrontService,
    private _translateNotificationsService: TranslateNotificationsService,
    private _route: Router /*private _autoCompleteService: AutocompleteService,*/
  ) /*private _sanitizer: DomSanitizer*/ {
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
      this._buildForm();
      this._companiesSelected = this._enterpriseService._enterprisesSelected;
      this._initTable([], 0);
      if (this._companiesSelected.length > 0) {
        this.queryConfig = this._enterpriseService._queryConfig;
      }
    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(
        ['settings', 'enterprises'].concat(path)
      );
    } else {
      return this._rolesFrontService.hasAccessAdminSide([
        'settings',
        'enterprises',
      ]);
    }
  }

  private _getCompanies(config: Config) {
    this._isSearching = true;
    this._resultTableConfiguration._total = -1;
    this._enterpriseService
      .get(null, config)
      .pipe(first())
      .subscribe(
        (enterprises: any) => {
          if (enterprises && enterprises.result && enterprises.result.length) {
            this._results = true;
            this._initTable(
              enterprises.result,
              enterprises._metadata.totalCount
            );
          } else {
            this._resultTableConfiguration._total = 0;
          }
          this._isSearching = false;
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorMessage(err.status)
          );
          this._isSearching = false;
          console.error(err);
        }
      );
  }

  private _initTable(content: Array<any> = [], total: number = -1) {
    this._resultTableConfiguration = {
      _selector: 'admin-enterprises-table',
      _title: 'Enterprises',
      _content: content,
      _total: total,
      _isTitle: true,
      _isSearchable: !!this.canAccess(['searchBy']),
      _isSelectable: true,
      _isPaginable: total > 10,
      _buttons: this._customButtons,
      _isDeletable: this.canAccess(['delete']),
      _isNoMinHeight: total < 11,
      _isEditable: this.canAccess(['edit']),
      _clickIndex:
        this.canAccess(['edit']) || this.canAccess(['view']) ? 2 : null,
      _columns:
        [
          {
            _attrs: ['logo.uri'],
            _name: 'Logo',
            _type: 'PICTURE',
            _width: '120px',
            _isHidden: !this.canAccess(['tableColumns', 'logo']),
          },
          {
            _attrs: ['name'],
            _name: 'Name',
            _type: 'TEXT',
            _isSortable: true,
            _isSearchable: this.canAccess(['searchBy', 'name']),
            _isHidden: !this.canAccess(['tableColumns', 'name']),
          },
          {
            _attrs: ['topLevelDomain'],
            _name: 'Domain',
            _type: 'TEXT',
            _enableTooltip: true,
            _isSortable: true,
            _isSearchable: this.canAccess(['searchBy', 'domain']),
            _isHidden: !this.canAccess(['tableColumns', 'domain']),
          },
          {
            _attrs: ['patterns'],
            _name: 'Patterns',
            _type: 'LENGTH',
            _width: '120px',
            _enableTooltip: true,
            _isHidden: !this.canAccess(['tableColumns', 'patterns']),
          },
          {
            _attrs: ['enterpriseURL'],
            _name: 'Enterprise Url',
            _type: 'TEXT',
            _isSortable: true,
            _enableTooltip: true,
            _isHidden: !this.canAccess(['tableColumns', 'url']),
          },
          {
            _attrs: ['subsidiariesList'],
            _name: 'Subsidiaries',
            _type: 'LENGTH',
            _width: '120px',
            _isHidden: !this.canAccess(['tableColumns', 'subsidiary']),
          },
          {
            _attrs: ['parentEnterprise'],
            _name: 'Parent Enterprise',
            _type: 'TEXT',
            _isHidden: true,
          },
          {
            _attrs: ['parentEnterpriseObject'],
            _name: 'Parent Enterprise',
            _type: 'NAME-LABEL-LIST',
            _width: '170px',
            _isHidden: !this.canAccess(['tableColumns', 'parent']),
          },
          {
            _attrs: ['goodEmails'],
            _name: 'Good emails',
            _type: 'NUMBER',
            _isHidden: !this.canAccess(['tableColumns', 'goodEmails']),
          },
          {
            _attrs: ['bouncedEmails'],
            _name: 'Deduced emails',
            _type: 'NUMBER',
            _width: '170px',
            _isHidden: !this.canAccess(['tableColumns', 'deducedEmails']),
          },
          {
            _attrs: ['shieldEmails'],
            _name: 'Shield emails',
            _type: 'NUMBER',
            _isHidden: !this.canAccess(['tableColumns', 'shieldEmails']),
          },
          {
            _attrs: ['industries'],
            _name: 'Industry',
            _type: 'LABEL-OBJECT-LIST',
            _enableTooltip: true,
            _isHidden: !this.canAccess(['tableColumns', 'industry']),
          },
          {
            _attrs: ['brands'],
            _name: 'Brand',
            _type: 'LABEL-OBJECT-LIST',
            _enableTooltip: true,
            _isHidden: !this.canAccess(['tableColumns', 'brand']),
          },
          {
            _attrs: ['enterpriseType'],
            _name: 'Type',
            _type: 'TEXT',
            _isSearchable: this.canAccess(['searchBy', 'type']),
            _isSortable: true,
            _enableTooltip: true,
            _isHidden: !this.canAccess(['tableColumns', 'type']),
          },
          {
            _attrs: ['geographicalZone'],
            _name: 'Geographical Zone',
            _type: 'NAME-LABEL-LIST',
            _width: '190px',
            _enableTooltip: true,
            _isHidden: !this.canAccess(['tableColumns', 'geoZone']),
          },
          {
            _attrs: ['enterpriseSize'],
            _name: 'Company size',
            _type: 'TEXT',
            _isSortable: true,
            _isHidden: !this.canAccess(['tableColumns', 'size']),
          },
          {
            _attrs: ['valueChain'],
            _name: 'Value chain',
            _type: 'TEXT',
            _isSortable: true,
            _enableTooltip: true,
            _isHidden: !this.canAccess(['tableColumns', 'valueChain']),
          },
        ],
    };
    if (total > 0 && this._companiesSelected.length > 0) {
      this._resultTableConfiguration._total = -1;
      this._resultTableConfiguration._content.map((item) => {
        item._isSelected = !!this._companiesSelected.find(
          (data) => data._id === item._id
        );
      });
      setTimeout(() => {
        this._resultTableConfiguration._total = total;
      }, 800);
    }
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
          type: 'CREATE',
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
          type: 'EDIT',
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

  public updateEnterprise(event: { enterprise: Enterprise; opType: string }) {
    switch (event.opType) {
      case 'CREATE':
        this._enterpriseService
          .create(event.enterprise)
          .pipe(first())
          .subscribe(
            (result) => {
              this._isSaving = false;
              this._translateNotificationsService.success(
                'Success',
                'The enterprise is created.'
              );
              this._selectedEnterprise = <Enterprise>{};
            },
            (err: HttpErrorResponse) => {
              this._translateNotificationsService.error(
                'ERROR.ERROR',
                ErrorFrontService.getErrorMessage(err.status)
              );
              this._isSaving = false;
              console.error(err);
            }
          );
        break;

      case 'EDIT':
        this._enterpriseService
          .save(this._selectedEnterprise._id, event.enterprise)
          .pipe(first())
          .subscribe(
            (result) => {
              this._isSaving = false;
              this._translateNotificationsService.success(
                'Success',
                'The enterprise is updated.'
              );
              const idx = this._resultTableConfiguration._content.findIndex(
                (value) => {
                  return value._id === result['_id'];
                }
              );
              if (idx > -1) {
                this._resultTableConfiguration._content[idx] = result;
                this._resultTableConfiguration._content[idx]['parentEnterpriseObject'] = event.enterprise.parentEnterpriseObject;
                this._resultTableConfiguration._content[idx]['subsidiariesList'] = event.enterprise.subsidiariesList;
              }

              if (!event.enterprise.parentEnterpriseObject || !event.enterprise.parentEnterpriseObject.length) {
                this.removeSubsidiariesList(this._selectedEnterprise._id);
              }

              if (event.enterprise.parentEnterpriseObject && event.enterprise.parentEnterpriseObject.length) {
                this.addSubsidiariesList(event.enterprise);
              }

              if (event.enterprise.subsidiariesList && event.enterprise.subsidiariesList.length) {
                this.addParentEnterprise(event.enterprise);
              }
            },
            (err: HttpErrorResponse) => {
              this._translateNotificationsService.error(
                'ERROR.ERROR',
                ErrorFrontService.getErrorMessage(err.status)
              );
              this._isSaving = false;
              console.error(err);
            }
          );
        break;
    }
  }

  /**
   * when remove subs
   * @param subsidiaryId
   */
  removeSubsidiariesList(subsidiaryId: string) {
    this._resultTableConfiguration._content.map(enterprise => {
      if (enterprise.subsidiariesList && enterprise.subsidiariesList.length) {
        enterprise.subsidiariesList = enterprise.subsidiariesList.filter((sub: any) => sub._id !== subsidiaryId);
      }
    });
  }

  /**
   * when delete a company, remove others' parentEnterprise if needed
   * @param parent
   */
  removeParentEnterprise(parent: Enterprise) {
    this._resultTableConfiguration._content.map(enterprise => {
      if (enterprise.parentEnterprise && parent._id) {
        enterprise.parentEnterprise = null;
        enterprise.parentEnterpriseObject = [];
      }
    });
  }

  /**
   * when create/update a company, company choose some subs, find subs and add parent
   * @param parent
   */
  addParentEnterprise(parent: Enterprise) {
    this._resultTableConfiguration._content.map(enterprise => {
      if (enterprise._id && parent.subsidiariesList.find(sub => sub._id === enterprise._id)) {
        enterprise.parentEnterprise = parent._id;
        enterprise.parentEnterpriseObject = [parent];
      }
    });
  }

  /**
   * when create/update a company, company choose a parent enterprise, push subsidiary into this parentEnterprise
   * @param subsidiary
   */
  addSubsidiariesList(subsidiary: Enterprise) {
    this._resultTableConfiguration._content.map(enterprise => {
      if (enterprise._id === subsidiary.parentEnterprise) {
        enterprise.subsidiariesList.push(subsidiary);
      }
    });
  }

  public removeCompanies(event: any) {
    let requests = 0;
    event.map((evt: any) => {
      this._enterpriseService.remove(evt._id).pipe(first()).subscribe(result => {
        if (result) {
          requests++;
          this._resultTableConfiguration._content = this._resultTableConfiguration._content.filter(enterprise => enterprise._id !== evt._id);
          this.removeSubsidiariesList(evt._id);
          this.removeParentEnterprise(evt);
        }
        if (requests === event.length) {
          this._translateNotificationsService.success('Success', 'Delete companies');
        }
      }, err => {
        this._translateNotificationsService.error('Error', 'An error occurred');
        console.error(err);
      });
    });
  }


  get results(): boolean {
    return this._results;
  }

  get searchForm(): FormGroup {
    return this._searchForm;
  }

  get isSearching(): boolean {
    return this._isSearching;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get resultTableConfiguration(): Table {
    return this._resultTableConfiguration;
  }

  get queryConfig(): any {
    return this._queryConfig;
  }

  set queryConfig(value: any) {
    this._queryConfig = value;
    if (this._queryConfig.search === '{}') {
      this._initTable([], 0);
    } else {
      this._getCompanies(this._queryConfig);
    }
  }

  get nothingFound(): boolean {
    return this._nothingFound;
  }

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

  performAction($event: any) {
    this._enterpriseService.setQueryConfig(this._queryConfig);
    this._enterpriseService.setEnterprisesSelected($event._rows);
    if ($event._action === 'Add parent') {
      this._route.navigate(['/user/admin/settings/enterprises/addparent']);
    }
    if ($event._action === 'Bulk edit') {
      this._route.navigate(['/user/admin/settings/enterprises/bulkedit']);
    }
  }
}
