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
import {FormBuilder, FormGroup} from '@angular/forms';
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
  private _inputType = '';
  private _isEditable = true;
  private _objectInputList: any = [];
  private _newObjectList: any[] = [];
  private _isShowModal = false;
  private _form: FormGroup;
  private _scope = 'country';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _rolesFrontService: RolesFrontService,
              private _router: Router,
              private _formBuilder: FormBuilder,
              private _notificationService: NotificationsService,
              private _entrepriseService: EnterpriseService,
              private _localStorageService: LocalStorageService) {
  }


  get scope(): string {
    return this._scope;
  }

  private _buildForm() {
    this._form = this._formBuilder.group({
      formObjectArray: [null],
    });
  }

  get success(): number {
    return this._success;
  }


  get isShowModal(): boolean {
    return this._isShowModal;
  }

  set isShowModal(value: boolean) {
    this._isShowModal = value;
  }

  get objectConfig(): any {
    return {
      placeholder: 'Add new value',
      initialData: this._objectInputList
    };
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  get inputType(): string {
    return this._inputType;
  }

  set inputType(value: string) {
    this._inputType = value;
  }

  set success(value: number) {
    this._success = value;
  }

  get newObjectList(): any[] {
    return this._newObjectList;
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
      // _isSearchable: !!this.canAccess(['searchBy']),
      // _isSelectable: this.canAccess(['delete']),
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
          _attrs: ['patterns'],
          _name: 'Patterns',
          _type: 'PATTERNS-OBJECT-LIST',
          _width: '120px',
          _isHidden: !this.canAccess(['tableColumns', 'patterns'])
        },
        {
          _attrs: ['enterpriseURL'],
          _name: 'Enterprise Url',
          _type: 'TEXT',
          // _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'url'])
        },
        {
          _attrs: ['industries'],
          _name: 'Industry',
          _type: 'LABEL-OBJECT-LIST',
          // _isSearchable: true,
          // _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['brands'],
          _name: 'Brand',
          _type: 'LABEL-OBJECT-LIST',
          // _isSearchable: true,
          // _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['enterpriseType'],
          _name: 'Type',
          _type: 'TEXT',
          // _isSearchable: true,
          // _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['geographicalZone'],
          _name: 'Geographical Zone',
          _type: 'GEO-ZONE-LIST',
          // _isSearchable: true,
          // _isSortable: true,
          _width: '190px',
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['enterpriseSize'],
          _name: 'Company size',
          _type: 'TEXT',
          // _isSearchable: true,
          // _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['valueChain'],
          _name: 'Value chain',
          _type: 'TEXT',
          // _isSearchable: true,
          // _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        }
      ]
    };

  }

  ngOnInit(): void {
    this._buildForm();
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
    if ((this.inputValue || this.newObjectList.length > 0) && this.columnAttrsSelected) {
      this.inputValue = encodeURIComponent(this.inputValue);
      this.updateColumnWithInputValue(this.columnAttrsSelected, this.inputValue);
    }
  }

  updateColumnWithInputValue(column: string, value: string) {
    console.log(this.companiesTable._content);
    console.log(column);
    this.companiesTable._content.map(item => {
      const columnToAddStyle = this.companiesTable._columns.find(data => data._attrs.toString() === this.columnAttrsSelected);
      if (columnToAddStyle) {
        columnToAddStyle._color = '#EA5858';
        columnToAddStyle._isFilled = true;
      }
      if (this.inputType === 'text') {
        item[column] = value;
      } else {
        item[column] = this.newObjectList;
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
  }

  getNotification() {
    if (this._success === this.companiesTable._content.length) {
      this._notificationService.success('Success', 'Update all succeed');
    } else if (this._failed === this.companiesTable._content.length) {
      this._notificationService.error('Error', 'Update all failed');
    } else {
      this._notificationService.error('Warning', this.success + 'update succeed, ' + this.failed + 'update failed.');
    }
    this.initState();
  }

  initState() {
    this._localStorageService.setItem('companiesSelected', JSON.stringify(this.companiesTable._content));
    this.success = 0;
    this.failed = 0;
    this.isShowModal = false;
    this._newObjectList = [];
    this.inputValue = '';
  }

  getInputType() {
    this._newObjectList = [];
    switch (this.columnAttrsSelected) {
      case 'logo.uri':
      case 'name':
      case 'enterpriseType':
      case 'enterpriseURL':
      case 'enterpriseSize':
      case 'valueChain':
        this.inputType = 'text';
        break;
      case 'patterns':
      case 'geographicalZone':
      case 'brands':
      case 'industries':
        this.inputType = 'objectArray';
        this._objectInputList = [];
        this.isShowModal = true;
        break;
    }
  }

  getColumnStyle() {

  }


  get form(): FormGroup {
    return this._form;
  }

  public objectListUpdate(event: { value: Array<any> }) {
    if (this.isEditable) {
      this._newObjectList = event.value.map((text) => {
        let newObject = {};
        switch (this.columnAttrsSelected) {
          case 'brands':
            newObject = {
              label: text.text,
              url: ''
            };
            break;
          case 'industries':
            newObject = {
              label: text.text,
              url: ''
            };
            break;
          case 'patterns':
            newObject = {
              expression: text.text,
              avgScore: 0
            };
            break;
          case 'geographicalZone':
            newObject = {
              scope: this.scope,
              name: text.text
            };
            break;
        }
        return newObject;
      });
    }
  }
}
