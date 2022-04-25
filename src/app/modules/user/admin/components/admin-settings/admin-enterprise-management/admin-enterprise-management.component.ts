import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { EnterpriseService } from '../../../../../../services/enterprise/enterprise.service';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { Router } from '@angular/router';
import { EnterpriseValueChains, Industries } from '../../../../../../models/static-data/enterprise';
import {
  Table,
  UmiusConfigInterface,
  UmiusEnterpriseInterface,
  UmiusSidebarInterface
} from '@umius/umi-common-component';

@Component({
  templateUrl: './admin-enterprise-management.component.html',
})
export class AdminEnterpriseManagementComponent implements OnInit {
  private _searchForm: FormGroup = this._formBuilder.group({
    searchString: [''],
  });

  loading = false;

  private _isSearching = false;

  private _sidebarValue: UmiusSidebarInterface = <UmiusSidebarInterface>{};

  private _results = false;

  private _nothingFound = false;

  private _companiesSelected: Array<any> = [];

  private _queryConfig: UmiusConfigInterface = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"goodEmails":-1}',
  };

  private _resultTableConfiguration: Table = <Table>{};

  private _isSaving = false;

  private _isLoading = false;

  private _selectedEnterprise: UmiusEnterpriseInterface = <UmiusEnterpriseInterface>{};

  private _isEditable = false;

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
    private _route: Router
  ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
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

  private _getCompanies(config: UmiusConfigInterface) {
    this._isSearching = true;
    this._resultTableConfiguration._total = -1;
    this._enterpriseService
      .get(null)
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
            ErrorFrontService.getErrorKey(err.error)
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
      _paginationTemplate: 'TEMPLATE_1',
      _actions: this._customButtons,
      _isDeletable: this.canAccess(['delete']),
      _isNoMinHeight: total < 11,
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
            _width: '180px',
            _isSortable: true,
            _isSearchable: this.canAccess(['searchBy', 'domain']),
            _isHidden: !this.canAccess(['tableColumns', 'domain']),
            _isEditable: true,
            _editType: 'TEXT',
          },
          {
            _attrs: ['patterns'],
            _name: 'Patterns',
            _type: 'LENGTH',
            _width: '120px',
            _isHidden: !this.canAccess(['tableColumns', 'patterns']),
          },
          {
            _attrs: ['enterpriseURL'],
            _name: 'Enterprise Url',
            _type: 'TEXT',
            _width: '250px',
            _isSortable: true,
            _isHidden: !this.canAccess(['tableColumns', 'url']),
            _isEditable: true,
            _editType: 'TEXT',
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
            _type: 'LABEL-OBJECT-LIST',
            _label: 'name',
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
            _width: '280px',
            _isHidden: !this.canAccess(['tableColumns', 'industry']),
            _isEditable: true,
            _editType: 'MULTI-INPUT',
            _label: 'label',
            _multiInput: {
              sourceList: Industries,
              property: ['label', 'code']
            },
            _tooltip: 'When editing, enter a comma (,)' + '\n' + ' to enable the search',
          },
          {
            _attrs: ['brands'],
            _name: 'Brand',
            _type: 'LABEL-OBJECT-LIST',
            _isHidden: !this.canAccess(['tableColumns', 'brand']),
            _label: 'label'
          },
          {
            _attrs: ['enterpriseType'],
            _name: 'Type',
            _type: 'TEXT',
            _width: '180px',
            _isSearchable: this.canAccess(['searchBy', 'type']),
            _isSortable: true,
            _isHidden: !this.canAccess(['tableColumns', 'type']),
            _isEditable: true,
            _choices: [
              {_name: 'Publique', _alias: 'Publique'},
              {_name: 'Privée', _alias: 'Privée'},
              {_name: 'Association', _alias: 'Association'},
            ],
            _editType: 'MULTI-CHOICES'
          },
          {
            _attrs: ['geographicalZone'],
            _name: 'Geographical Zone',
            _type: 'LABEL-OBJECT-LIST',
            _width: '190px',
            _isHidden: !this.canAccess(['tableColumns', 'geoZone']),
            _label: 'name'
          },
          {
            _attrs: ['valueChain'],
            _name: 'Value chain',
            _type: 'TEXT',
            _width: '280px',
            _isSortable: true,
            _isHidden: !this.canAccess(['tableColumns', 'valueChain']),
            _isEditable: true,
            _editType: 'MULTI-INPUT',
            _tooltip: 'When editing, enter a comma (,)' + '\n' + ' to enable the search',
            _multiInput: {
              sourceList: EnterpriseValueChains,
            }
          },
          {
            _attrs: ['enterpriseSize'],
            _name: 'Company size',
            _type: 'TEXT',
            _width: '190px',
            _isSortable: true,
            _isHidden: !this.canAccess(['tableColumns', 'size']),
            _isEditable: true,
            _choices: [
              {_name: 'TPE', _alias: 'Tpe'},
              {_name: 'PME', _alias: 'Pme'},
              {_name: 'ETI', _alias: 'Eti'},
              {_name: 'GE', _alias: 'Ge'},
            ],
            _editType: 'MULTI-CHOICES'
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
        this._isEditable = this.canAccess(['add']);
        this._isSaving = false;
        this._selectedEnterprise = <UmiusEnterpriseInterface>{};
        this._sidebarValue = {
          animate_state: 'active',
          title: 'Create Enterprise',
          type: 'CREATE',
        };
        break;

      case 'EDIT':
        this._isEditable = this.canAccess(['edit']);
        this._isSaving = false;
        this._sidebarValue = {
          animate_state: 'active',
          title: this._isEditable ? 'Edit Enterprise' : 'Enterprise',
          type: 'EDIT',
        };
        this._selectedEnterprise = event;
        break;
    }
  }

  public updateEnterprise(event: { enterprise: UmiusEnterpriseInterface; opType: string, enterpriseBeforeUpdate?: UmiusEnterpriseInterface }) {
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
              this._selectedEnterprise = <UmiusEnterpriseInterface>{};
            },
            (err: HttpErrorResponse) => {
              this._translateNotificationsService.error(
                'ERROR.ERROR',
                ErrorFrontService.getErrorKey(err.error)
              );
              this._isSaving = false;
              console.error(err);
            }
          );
        break;

      case 'EDIT':
        const enterpriseBeforeUpdateDataForm = {
          domain: event.enterpriseBeforeUpdate.topLevelDomain || '',
          name: event.enterpriseBeforeUpdate.name || '',
          logo: event.enterpriseBeforeUpdate.logo || ''
        };
        this._enterpriseService
          .save(this._selectedEnterprise._id, event.enterprise, enterpriseBeforeUpdateDataForm)
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
            },
            (err: HttpErrorResponse) => {
              this._translateNotificationsService.error(
                'ERROR.ERROR',
                ErrorFrontService.getErrorKey(err.error)
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
  removeParentEnterprise(parent: UmiusEnterpriseInterface) {
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
  addParentEnterprise(parent: UmiusEnterpriseInterface) {
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
   * @param subsidiaryId
   */
  addSubsidiariesList(subsidiary: UmiusEnterpriseInterface, subsidiaryId: string) {
    this._resultTableConfiguration._content.map(enterprise => {
      if (enterprise._id === subsidiary.parentEnterprise) {
        subsidiary['_id'] = subsidiaryId;
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
          this._resultTableConfiguration._content = this._resultTableConfiguration
            ._content.filter(enterprise => enterprise._id !== evt._id);
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

  performAction($event: any) {
    this._enterpriseService.setQueryConfig(this._queryConfig);
    this._enterpriseService.setEnterprisesSelected($event._rows);
    switch ($event._action) {
      // cell edit
      case 'Update grid':
        const context = $event._context;
        if (context) {
          this.saveEnterprise(context);
        }
        break;
      case 'Add parent':
        this._route.navigate(['/user/admin/settings/enterprises/addparent']);
        break;
      case 'Bulk edit':
        this._route.navigate(['/user/admin/settings/enterprises/bulkedit']);
        break;
    }
  }

  private saveEnterprise(enterprise: UmiusEnterpriseInterface) {
    this._enterpriseService
      .save(enterprise._id, enterprise)
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
            this._resultTableConfiguration._content[idx]['parentEnterpriseObject'] = enterprise.parentEnterpriseObject;
            this._resultTableConfiguration._content[idx]['subsidiariesList'] = enterprise.subsidiariesList;
          }
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          this._isSaving = false;
          console.error(err);
        }
      );
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

  get sidebarValue(): UmiusSidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: UmiusSidebarInterface) {
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

  get selectedEnterprise(): UmiusEnterpriseInterface {
    return this._selectedEnterprise;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }
}
