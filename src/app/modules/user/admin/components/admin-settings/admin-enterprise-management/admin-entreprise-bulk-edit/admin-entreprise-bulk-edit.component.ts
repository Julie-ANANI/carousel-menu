import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {Table} from '../../../../../../table/models/table';
import {RolesFrontService} from '../../../../../../../services/roles/roles-front.service';
import {Config} from '../../../../../../../models/config';
import {LocalStorageService} from '../../../../../../../services/localStorage/localStorage.service';
import {EnterpriseService} from '../../../../../../../services/enterprise/enterprise.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationsService} from 'angular2-notifications';
// import {SwellrtBackend} from "../swellrt-client/services/swellrt-backend";
// import {UserService} from "../../services/user/user.service";

// declare let swellrt;

@Component({
  templateUrl: './admin-entreprise-bulk-edit.component.html',
  styleUrls: ['./admin-entreprise-bulk-edit.component.scss']
})

export class AdminEntrepriseBulkEditComponent implements OnInit {
  private _companiesToEdit: Array<any> = [];
  private _companiesTable: Table = <Table>{};
  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _columnAttrsSelected: string = null;
  private _inputValue = '';

  private _success = 0;
  private _failed = 0;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _rolesFrontService: RolesFrontService,
              private _router: Router,
              private _notificationService: NotificationsService,
              private _entrepriseService: EnterpriseService,
              private _localStorageService: LocalStorageService) {
  }


  get success(): number {
    return this._success;
  }

  set success(value: number) {
    this._success = value;
  }

  get failed(): number {
    return this._failed;
  }

  set failed(value: number) {
    this._failed = value;
  }

  get columnAttrsSelected(): string {
    return this._columnAttrsSelected;
  }

  set columnAttrsSelected(value: string) {
    this._columnAttrsSelected = value;
  }

  get inputValue(): string {
    return this._inputValue;
  }

  set inputValue(value: string) {
    this._inputValue = value;
  }

  set config(value: Config) {
    this._config = value;
  }

  get config(): Config {
    return this._config;
  }

  get companiesToEdit(): Array<any> {
    return this._companiesToEdit;
  }

  set companiesToEdit(value: Array<any>) {
    this._companiesToEdit = value;
  }

  get companiesTable(): Table {
    return this._companiesTable;
  }

  _initTable() {
    this._companiesTable = {
      _selector: 'admin-enterprises-bulk-edit-table',
      _title: this.companiesToEdit.length > 1 ? 'Companies selected' : 'Company selected',
      _content: this.companiesToEdit,
      _total: this.companiesToEdit.length,
      _isTitle: true,
      _isSearchable: !!this.canAccess(['searchBy']),
      _isSelectable: this.canAccess(['delete']),
      _isPaginable: this.companiesToEdit.length > 10,
      _isDeletable: this.canAccess(['delete']),
      _isNoMinHeight: this.companiesToEdit.length < 11,
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
          _isHidden: !this.canAccess(['tableColumns', 'patterns'])
        },
        {
          _attrs: ['patterns.expression'],
          _name: 'Patterns',
          _type: 'TEXT',
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
          _attrs: ['industries.label'],
          _name: 'Industry',
          _type: 'TEXT',
          _isSearchable: true,
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['brands.label'],
          _name: 'Brand',
          _type: 'TEXT',
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
          _attrs: ['geographicalZone.name'],
          _name: 'Geographical Zone',
          _type: 'TEXT',
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

  ngOnInit(): void {
    this.companiesToEdit = JSON.parse(this._localStorageService.getItem('companiesSelected'));
    if (this.companiesToEdit) {
      this._initTable();
    } else {
      this._router.navigate(['/user/admin/settings/enterprises']);
    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'enterprises'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'enterprises']);
    }
  }

  update() {
    if (this.inputValue && this.columnAttrsSelected) {
      this.inputValue = encodeURIComponent(this.inputValue);
      this.updateColumnWithInputValue(this.columnAttrsSelected, this.inputValue);
    }
  }

  getFormOfItem(attribute: string, value: string) {
    let form = {};
    switch (attribute) {
      case 'industries':
        form = {
          label: value,
          code: ''
        };
        break;
      case 'brands':
        form = {
          label: value,
          url: ''
        };
        break;
    }
    return form;
  }

  updateColumnWithInputValue(column: string, value: string) {
    console.log(this.companiesTable._content);
    console.log(column);
    this.companiesTable._content.map(item => {
      if (column.includes('.')) {
        const keyArr = column.split('.');
        const form = this.getFormOfItem(keyArr[0], value);
        item[keyArr[0]].push(form);
      } else {
        item[column] = value;
      }
      this._entrepriseService.save(item._id, item).pipe(first()).subscribe(
        (result) => {
          console.log(result);
          this._success += 1;
          if (this._success + this.failed === this.companiesTable._content.length) {
            this.getNotification();
          }
        },
        (err: HttpErrorResponse) => {
          this._failed += 1;
          if (this._success + this.failed === this.companiesTable._content.length) {
            this.getNotification();
          }
          console.error(err);
        });
    });
    this.inputValue = '';
  }

  getNotification() {
    console.log(this.success, this.failed, this.companiesTable._content.length);
    if (this._success === this.companiesTable._content.length) {
      this._notificationService.success('Success', 'Update all succeed');
    } else if (this._failed === this.companiesTable._content.length) {
      this._notificationService.error('Error', 'Update all failed');
    } else {
      this._notificationService.error('Warning', this.success + 'update succeed, ' + this.failed + 'update failed.');
    }
    this._localStorageService.setItem('companiesSelected', JSON.stringify(this.companiesTable._content));
    this.success = 0;
    this.failed = 0;
  }
}
