import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { EnterpriseService } from '../../../../../../../services/enterprise/enterprise.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { Column, Table, UmiusConfigInterface, UmiusEnterpriseInterface } from '@umius/umi-common-component';
import { TranslateNotificationsService } from "../../../../../../../services/translate-notifications/translate-notifications.service";
import { ErrorFrontService } from "../../../../../../../services/error/error-front.service";


@Component({
  templateUrl: './admin-entreprise-add-parent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEntrepriseAddParentComponent implements OnInit {
  private _companiesToAddParent: Array<any> = [];
  private _parentCompany: UmiusEnterpriseInterface = <UmiusEnterpriseInterface>{};
  private _companiesTable: Table = <Table>{};
  private _companiesOriginalTable: Table = <Table>{};
  private _companiesToSwapTable: Table = <Table>{};
  private _config: UmiusConfigInterface = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}',
  };

  private _success = 0;

  private _failed = 0;

  private _data: any = [];
  configCompany = {
    placeholder: 'Enter the parent company',
    initialData: this._data,
    type: 'enterprise',
    showDomain: true,
  };

  constructor(
    @Inject(PLATFORM_ID) protected _platformId: Object,
    private _router: Router,
    private _notificationService: NotificationsService,
    private _entrepriseService: EnterpriseService,
    private _rolesFrontService: RolesFrontService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _translateNotificationsService: TranslateNotificationsService
  ) {
  }

  ngOnInit(): void {
    this._companiesToAddParent = this._entrepriseService._enterprisesSelected;
    this._initTable();
  }

  _initTable() {
    this._companiesTable = {
      _selector: 'admin-enterprises-bulk-edit-table',
      _title:
        this.companiesToAddParent.length > 1
          ? 'Companies selected'
          : 'Company selected',
      _content: this.companiesToAddParent,
      _total: this.companiesToAddParent.length,
      _isTitle: true,
      _isLegend: true,
      _isPaginable: this.companiesToAddParent.length > 10,
      _isNoMinHeight: this.companiesToAddParent.length < 11,
      _columns: [
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
          _isHidden: !this.canAccess(['tableColumns', 'name']),
        },
        {
          _attrs: ['parentEnterpriseObject'],
          _name: 'Parent Enterprise',
          _type: 'LABEL-OBJECT-LIST',
          _label: 'name',
          _isHidden: true,
        },
        {
          _attrs: ['topLevelDomain'],
          _name: 'Domain',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'domain']),
        },
        {
          _attrs: ['patterns'],
          _name: 'Patterns',
          _type: 'LABEL-OBJECT-LIST',
          _label: 'expression',
          _width: '120px',
          _isHidden: !this.canAccess(['tableColumns', 'patterns']),
        },
        {
          _attrs: ['enterpriseURL'],
          _name: 'Enterprise Url',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'url']),
        },
        {
          _attrs: ['industries'],
          _name: 'Industry',
          _type: 'LABEL-OBJECT-LIST',
          _label: 'label',
          _isHidden: !this.canAccess(['tableColumns', 'industry']),
        },
        {
          _attrs: ['brands'],
          _name: 'Brand',
          _type: 'LABEL-OBJECT-LIST',
          _label: 'label',
          _isHidden: !this.canAccess(['tableColumns', 'brand']),
        },
        {
          _attrs: ['enterpriseType'],
          _name: 'Type',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'type']),
        },
        {
          _attrs: ['geographicalZone'],
          _name: 'Geographical Zone',
          _type: 'LABEL-OBJECT-LIST',
          _label: 'name',
          _width: '190px',
          _isHidden: !this.canAccess(['tableColumns', 'geoZone']),
        },
        {
          _attrs: ['enterpriseSize'],
          _name: 'Company size',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'size']),
        },
        {
          _attrs: ['valueChain'],
          _name: 'Value chain',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'valueChain']),
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
      ],
    };
    this._companiesTable._content.map((item) => {
      item._isSelected = false;
    });
    this._companiesOriginalTable = JSON.parse(
      JSON.stringify(this._companiesTable)
    );
    this._companiesToSwapTable = JSON.parse(
      JSON.stringify(this._companiesTable)
    );
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(
        ['settings', 'enterprises', 'addParent'].concat(path)
      );
    } else {
      return this._rolesFrontService.hasAccessAdminSide([
        'settings',
        'enterprises',
        'addParent'
      ]);
    }
  }

  get parentCompany(): UmiusEnterpriseInterface {
    return this._parentCompany;
  }

  /**
   * get parent enterprise => replace values
   * @param event
   */
  addCompanyToInclude(event: { value: Array<string> }): void {
    this._entrepriseService
      .get(event.value[0]['id'])
      .pipe(first())
      .subscribe(
        (res) => {
          this._parentCompany = res;
          this.replaceChildrenWithParentValue();
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        }
      );
  }

  /**
   * add parentEnterpriseId to children
   * replace with parent values
   * blue: empty value in children, filled with parent value
   * red: children have value, can be replaced with parent value
   */
  replaceChildrenWithParentValue() {
    this._companiesTable._content.map((item) => {
      item.parentEnterprise = this._parentCompany._id || '';
      this._companiesTable._columns
        .slice(2, this._companiesTable._columns.length)
        .map((c) => {
          switch (c._attrs.toString()) {
            case 'topLevelDomain':
            case 'enterpriseType':
            case 'enterpriseSize':
            case 'enterpriseURL':
              if (this._parentCompany.hasOwnProperty(c._attrs[0])) {
                this.compareChildValueToFillReplace(item, c);
              }
              break;
            case 'valueChain':
            case 'industries':
            case 'patterns':
            case 'brands':
            case 'geographicalZone':
              if (this._parentCompany.hasOwnProperty(c._attrs[0])) {
                this.compareChildValueToFillReplace(item, c);
              }
              break;
          }
        });
    });
  }

  /**
   * compare child/parent's values: replace or fill values
   * @param item
   * @param c
   */
  compareChildValueToFillReplace(item: any, c: Column) {
    const isFilled = this.toBeFilled(item, c._attrs[0]);
    const isReplaced = this.toBeReplaced(item, c._attrs[0]);
    if (isFilled) {
      this.addFilledStyle(c);
      this.replaceChildValues(c._attrs[0], item);
    }
    if (isReplaced) {
      this.addReplaceStyle(c);
      this.replaceChildValues(c._attrs[0], item);
    }
    this._changeDetectorRef.markForCheck();
  }

  /**
   * filled: child empty + parent has values
   * @param child
   * @param attr
   */
  toBeFilled(child: any, attr: string) {
    if (child.hasOwnProperty(attr)) {
      if (typeof child[attr] === 'string') {
        return child[attr] === '' && this.parentCompany[attr] !== '';
      } else {
        return child[attr].length === 0 && this.parentCompany[attr].length > 0;
      }
    } else {
      return true;
    }

  }

  /**
   * child + parent both have values
   * @param child
   * @param attr
   */
  toBeReplaced(child: any, attr: string) {
    if (child.hasOwnProperty(attr)) {
      if (typeof child[attr] === 'string') {
        return child[attr] !== '' && this.parentCompany[attr] !== '';
      } else {
        return child[attr].length > 0 && this.parentCompany[attr].length > 0;
      }
    } else {
      return false;
    }
  }

  /**
   * replace child value with parent's
   * @param attr
   * @param child
   */
  replaceChildValues(attr: any, child: any) {
    child[attr] = this._parentCompany[attr];
  }

  /**
   * click button on exchange
   * @param context
   */
  exchangeValue(context: any) {
    if (context) {
      const rowIndex = context.row;
      const column = context.column;
      const temp = this.companiesTable._content[rowIndex][
        column._attrs.toString()
        ];
      this.companiesTable._content[rowIndex][
        column._attrs.toString()
        ] = this._companiesToSwapTable._content[rowIndex][
        column._attrs.toString()
        ];
      this._companiesToSwapTable._content[rowIndex][
        column._attrs.toString()
        ] = temp;
    }
  }

  /**
   * Update enterprises
   */
  updateChange() {
    // add subsidiaries in parent company
    this.updateParentCompany();
    this.companiesTable._content.map((item, index) => {
      this._entrepriseService
        .save(item._id, item, {
          name: this._companiesOriginalTable._content[index].name,
          domain: this._companiesOriginalTable._content[index].topLevelDomain,
        })
        .pipe(first())
        .subscribe(
          (result) => {
            this._success += 1;
            if (
              this._success + this._failed ===
              this.companiesTable._content.length
            ) {
              this.getNotification();
            }
          },
          (err: HttpErrorResponse) => {
            this._failed += 1;
            if (
              this._success + this._failed ===
              this.companiesTable._content.length
            ) {
              this.getNotification();
            }
            console.error(err);
          }
        );
    });
  }

  updateParentCompany() {
    const subsidiaries = this._parentCompany.subsidiaries || [];
    const subsidiariesToAdd = this.companiesTable._content.map(
      (sub) => {
        if (sub._id && subsidiaries.indexOf(sub._id) === -1) {
          return sub._id;
        }
      }
    );
    this._parentCompany.subsidiaries = subsidiariesToAdd.concat(subsidiaries);
    this._entrepriseService
      .save(this._parentCompany._id, this._parentCompany)
      .pipe(first())
      .subscribe(
        (res) => {
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error))
        }
      );
  }

  /**
   * get notification for users
   * @private
   */
  private getNotification() {
    if (this._success === this.companiesTable._content.length) {
      this._notificationService.success('Success', 'Update all succeed');
    } else if (this._failed === this.companiesTable._content.length) {
      this._notificationService.error('Error', 'Update all failed');
    } else {
      this._notificationService.error(
        'Warning',
        this._success + 'update succeed, ' + this._failed + 'update failed.'
      );
    }
    this.removeFillTemplate();
    this._success = 0;
    this._failed = 0;
  }

  /**
   * remove styles / initialize states in tables
   */
  removeFillTemplate() {
    this.companiesTable._columns.map((c) => {
      this.removeStyle(c);
    });
    this._companiesOriginalTable = JSON.parse(
      JSON.stringify(this._companiesTable)
    );
    this._changeDetectorRef.markForCheck();
  }

  addReplaceStyle(c: Column) {
    c._textColorConfig = {
      color: '#00B0FF',
      condition: 'replace',
      icon: 'fas fa-redo'
    }
  }

  addFilledStyle(c: Column) {
    c._textColorConfig = {
      color: '#EA5858',
      condition: 'fill',
      icon: 'fa-solid fa-arrows-rotate'
    }
  }

  removeStyle(c: Column) {
    delete c._textColorConfig;
  }

  returnTo(event: Event) {
    event.preventDefault();
    this._router.navigate(['/user/admin/settings/enterprises']);
  }

  cancel() {
    this._companiesTable = this._companiesOriginalTable;
  }

  getPerformAction($event: any) {
    if ($event._action === 'replace') {
      this.exchangeValue($event._context);
    }
  }

  get companiesToAddParent(): Array<any> {
    return this._companiesToAddParent;
  }

  get companiesTable(): Table {
    return this._companiesTable;
  }

  get config(): UmiusConfigInterface {
    return this._config;
  }

  set config(value: UmiusConfigInterface) {
    this._config = value;
  }
}
