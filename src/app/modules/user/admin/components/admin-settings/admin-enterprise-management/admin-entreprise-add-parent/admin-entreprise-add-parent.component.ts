import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {Table} from '../../../../../../table/models/table';
import {RolesFrontService} from '../../../../../../../services/roles/roles-front.service';
import {Config} from '../../../../../../../models/config';
import {EnterpriseService} from '../../../../../../../services/enterprise/enterprise.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Enterprise} from '../../../../../../../models/enterprise';
import {NotificationsService} from 'angular2-notifications';
import {Column} from '../../../../../../table/models/column';

@Component({
  templateUrl: './admin-entreprise-add-parent.component.html',
  styleUrls: ['./admin-entreprise-add-parent.component.scss']
})

export class AdminEntrepriseAddParentComponent implements OnInit {
  private _companiesToAddParent: Array<any> = [];
  private _parentCompany: Enterprise = <Enterprise>{};
  private _companiesTable: Table = <Table>{};
  private _companiesOriginalTable: Table = <Table>{};
  private _companiesToSwapTable: Table = <Table>{};
  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _success = 0;

  private _failed = 0;

  private _data: any = [];
  configCompany = {
    placeholder: 'Enter the parent company',
    initialData: this._data,
    type: 'company',
    showDomain: true
  };

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _router: Router,
              private _notificationService: NotificationsService,
              private _entrepriseService: EnterpriseService,
              private _rolesFrontService: RolesFrontService) {
  }


  get companiesToAddParent(): Array<any> {
    return this._companiesToAddParent;
  }

  get companiesTable(): Table {
    return this._companiesTable;
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
  }

  ngOnInit(): void {
    this._companiesToAddParent = this._entrepriseService._enterprisesSelected;
    this._initTable();
  }

  _initTable() {
    this._companiesTable = {
      _selector: 'admin-enterprises-bulk-edit-table',
      _title: this.companiesToAddParent.length > 1 ? 'Companies selected' : 'Company selected',
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
        },
        {
          _attrs: ['name'],
          _name: 'Name',
          _type: 'TEXT',
        },
        {
          _attrs: ['emailSettings.goodEmails'],
          _name: 'Good emails',
          _type: 'NUMBER',
        },
        {
          _attrs: ['emailSettings.bouncedEmails'],
          _name: 'Deduced emails',
          _type: 'NUMBER',
          _width: '170px',
        },
        {
          _attrs: ['shieldEmails'],
          _name: 'Shield emails',
          _type: 'NUMBER',
        },
        {
          _attrs: ['topLevelDomain'],
          _name: 'Domain',
          _type: 'TEXT',
        },
        {
          _attrs: ['patterns'],
          _name: 'Patterns',
          _type: 'PATTERNS-OBJECT-LIST',
          _width: '120px'
        },
        {
          _attrs: ['enterpriseURL'],
          _name: 'Enterprise Url',
          _type: 'TEXT',
        },
        {
          _attrs: ['industries'],
          _name: 'Industry',
          _type: 'LABEL-OBJECT-LIST',
        },
        {
          _attrs: ['brands'],
          _name: 'Brand',
          _type: 'LABEL-OBJECT-LIST',
        },
        {
          _attrs: ['enterpriseType'],
          _name: 'Type',
          _type: 'TEXT',
        },
        {
          _attrs: ['geographicalZone'],
          _name: 'Geographical Zone',
          _type: 'GEO-ZONE-LIST',
          _width: '190px',
        },
        {
          _attrs: ['enterpriseSize'],
          _name: 'Company size',
          _type: 'TEXT',
        },
        {
          _attrs: ['valueChain'],
          _name: 'Value chain',
          _type: 'TEXT',
        }
      ]
    };
    this._companiesTable._content.map(item => {
      item._isSelected = false;
    });
    this._companiesOriginalTable = JSON.parse(JSON.stringify(this._companiesTable));
    this._companiesToSwapTable = JSON.parse(JSON.stringify(this._companiesTable));
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'enterprises'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'enterprises']);
    }
  }


  get parentCompany(): Enterprise {
    return this._parentCompany;
  }

  /**
   * get parent enterprise => replace values
   * @param event
   */
  addCompanyToInclude(event: { value: Array<string> }): void {
    this._entrepriseService.get(event.value[0]['id'], null).pipe(first()).subscribe(res => {
        this._parentCompany = res;
        this.replaceChildrenWithParentValue();
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      });
  }

  /**
   * replace with parent values
   * blue: empty value in children, filled with parent value
   * red: children have value, can be replaced with parent value
   */
  replaceChildrenWithParentValue() {
    this._companiesTable._content.map(item => {
      this._companiesTable._columns.slice(2, this._companiesTable._columns.length).map(c => {
        switch (c._attrs.toString()) {
          case 'topLevelDomain':
          case 'enterpriseType':
          case 'enterpriseSize':
          case 'enterpriseURL':
            if (item.hasOwnProperty(c._attrs[0])) {
              this.compareChildValueToFillReplace(item, c);
            }
            break;
          case 'valueChain':
          case 'industries':
          case 'patterns':
          case 'brands':
          case 'geographicalZone':
            if (item.hasOwnProperty(c._attrs[0])) {
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
  }

  /**
   * filled: child empty + parent has values
   * @param child
   * @param attr
   */
  toBeFilled(child: any, attr: string) {
    if (typeof child[attr] === 'string') {
      return child[attr] === '' && this.parentCompany[attr] !== '';
    } else {
      return child[attr].length === 0 && this.parentCompany[attr].length > 0;
    }
  }

  /**
   * child + parent both have values
   * @param child
   * @param attr
   */
  toBeReplaced(child: any, attr: string) {
    if (typeof child[attr] === 'string') {
      return child[attr] !== '' && this.parentCompany[attr] !== '';
    } else {
      return child[attr].length > 0 && this.parentCompany[attr].length > 0;
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
      const temp = this.companiesTable._content[rowIndex][column._attrs.toString()];
      this.companiesTable._content[rowIndex][column._attrs.toString()]
        = this._companiesToSwapTable._content[rowIndex][column._attrs.toString()];
      this._companiesToSwapTable._content[rowIndex][column._attrs.toString()] = temp;
    }
  }

  /**
   * Update enterprises
   */
  updateChange() {
    this.companiesTable._content.map(item => {
      this._entrepriseService.save(item._id, item).pipe(first()).subscribe(
        (result) => {
          this._success += 1;
          if (this._success + this._failed === this.companiesTable._content.length) {
            this.getNotification();
          }
        },
        (err: HttpErrorResponse) => {
          this._failed += 1;
          if (this._success + this._failed === this.companiesTable._content.length) {
            this.getNotification();
          }
          console.error(err);
        });
    });
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
      this._notificationService.error('Warning', this._success + 'update succeed, ' + this._failed + 'update failed.');
    }
    this.removeFillTemplate();
    this._success = 0;
    this._failed = 0;
  }

  /**
   * remove styles / initialize states in tables
   */
  removeFillTemplate() {
    this.companiesTable._columns.map(c => {
      this.removeStyle(c);
    });
    this._companiesOriginalTable = JSON.parse(JSON.stringify(this._companiesTable));
  }

  addReplaceStyle(c: Column) {
    c._color = '#00B0FF';
    c._isReplaceable = true;
    c._isFilled = false;
  }

  addFilledStyle(c: Column) {
    c._isFilled = true;
    c._isReplaceable = true;
    c._color = '#EA5858';
  }

  removeStyle(c: Column) {
    c._color = '';
    c._isReplaceable = undefined;
    c._isFilled = undefined;
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
}
