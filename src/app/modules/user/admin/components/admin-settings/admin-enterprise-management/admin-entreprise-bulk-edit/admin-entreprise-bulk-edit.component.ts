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
import {AutoSuggestionConfig} from '../../../../../../utility/auto-suggestion/interface/auto-suggestion-config';
import {Column} from '../../../../../../table/models/column';
// import {SwellrtBackend} from "../swellrt-client/services/swellrt-backend";
// import {UserService} from "../../services/user/user.service";

// declare let swellrt;

@Component({
  templateUrl: './admin-entreprise-bulk-edit.component.html',
  styleUrls: ['./admin-entreprise-bulk-edit.component.scss']
})

export class AdminEntrepriseBulkEditComponent implements OnInit {
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
  };

  private _enterpriseTypeSelectConfig: AutoSuggestionConfig = {
    minChars: 0,
    placeholder: 'Enter the enterprise type',
    type: 'enterpriseType',
    identifier: '',
  };

  private _companiesToEdit: Array<any> = [];
  private _companiesTable: Table = <Table>{};
  private _companiesOriginalTable: Table = <Table>{};
  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _success = 0;
  private _failed = 0;
  private _inputType = '';
  private _isEditable = true;
  private _scope = 'country';
  _enterpriseUrlModel = '';
  _enterpriseTypeModel = '';
  _enterpriseSizeModel = '';

  private _industries: Array<any> = [];
  private _brands: Array<any> = [];
  private _patterns: Array<any> = [];
  private _geoZones: Array<any> = [];
  private _valueChains: Array<any> = [];
  private _enterpriseTypes: Array<any> = [];
  private _isOldValue = false;

  get enterpriseTypes(): Array<any> {
    return this._enterpriseTypes;
  }

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _rolesFrontService: RolesFrontService,
              private _router: Router,
              private _notificationService: NotificationsService,
              private _enterpriseService: EnterpriseService,
              private _localStorageService: LocalStorageService) {
  }


  get industrySelectConfig(): AutoSuggestionConfig {
    return this._industrySelectConfig;
  }

  get valueChainSelectConfig(): AutoSuggestionConfig {
    return this._valueChainSelectConfig;
  }

  get enterpriseSizeSelectConfig(): AutoSuggestionConfig {
    return this._enterpriseSizeSelectConfig;
  }

  get enterpriseTypeSelectConfig(): AutoSuggestionConfig {
    return this._enterpriseTypeSelectConfig;
  }

  get enterpriseSizeModel(): string {
    return this._enterpriseSizeModel;
  }

  set enterpriseSizeModel(value: string) {
    this._enterpriseSizeModel = value;
  }

  get enterpriseUrlModel(): string {
    return this._enterpriseUrlModel;
  }

  set enterpriseUrlModel(value: string) {
    this._enterpriseUrlModel = value;
  }

  get enterpriseTypeModel(): string {
    return this._enterpriseTypeModel;
  }

  set enterpriseTypeModel(value: string) {
    this._enterpriseTypeModel = value;
  }

  get scope(): string {
    return this._scope;
  }

  get success(): number {
    return this._success;
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

  get failed(): number {
    return this._failed;
  }

  set failed(value: number) {
    this._failed = value;
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

          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['brands'],
          _name: 'Brand',
          _type: 'LABEL-OBJECT-LIST',

          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['enterpriseType'],
          _name: 'Type',
          _type: 'TEXT',

          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['geographicalZone'],
          _name: 'Geographical Zone',
          _type: 'GEO-ZONE-LIST',

          _width: '190px',
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['enterpriseSize'],
          _name: 'Enterprise size',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        },
        {
          _attrs: ['valueChain'],
          _name: 'Value chain',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'parent'])
        }
      ]
    };
    this._companiesOriginalTable = JSON.parse(JSON.stringify(this._companiesTable));
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

  getNotification() {
    if (this._success === this.companiesTable._content.length) {
      this._notificationService.success('Success', 'Update all succeed');
    } else if (this._failed === this.companiesTable._content.length) {
      this._notificationService.error('Error', 'Update all failed');
    } else {
      this._notificationService.error('Warning', this.success + 'update succeed, ' + this.failed + 'update failed.');
    }
    this.removeFillTemplate();
    this.initState();
    this.resetFormValues();
  }

  initState() {
    this._localStorageService.setItem('companiesSelected', JSON.stringify(this.companiesTable._content));
    this.success = 0;
    this.failed = 0;
  }

  updateChange() {
    this.companiesTable._content.map(item => {
      this._enterpriseService.save(item._id, item).pipe(first()).subscribe(
        (result) => {
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

  undoFilled($event: any) {
    if ($event) {
      const rowIndex = $event.row;
      const column = $event.column;
      const tempValue = this.companiesTable._content[rowIndex][column._attrs.toString()];
      this.companiesTable._content[rowIndex][column._attrs.toString()]
        = this._companiesOriginalTable._content[rowIndex][column._attrs.toString()];
      this._companiesOriginalTable._content[rowIndex][column._attrs.toString()] = tempValue;
      if (!this._isOldValue) {
        column._color = '';
      } else {
        column._color = '#EA5858';
      }
      this._isOldValue = !this._isOldValue;
    }
  }

  removeFillTemplate() {
    this.companiesTable._columns.map(c => {
      c._color = '';
      c._isFilled = undefined;
    });
    this._companiesOriginalTable = JSON.parse(JSON.stringify(this._companiesTable));
  }

  return() {
    this._router.navigate(['/user/admin/settings/enterprises']);
  }

  getValueSelected($event: any) {
    if ($event) {
      switch ($event.type) {
        case 'industry':
          if (this._industries.length === 0 || this._industries.find(item => item.label === $event.value) === undefined) {
            this._industries.push({label: $event.value, code: $event.value});
            this.updateEnterpriseValues('industries', this._industries, 'Industry');
          }
          break;
        case 'valueChain':
          if (this._valueChains.length === 0 || !this._valueChains.toString().includes($event)) {
            this._valueChains.push($event.value);
            this.updateEnterpriseValues('valueChain', this._valueChains, 'Value chain');
          }
          break;
        case 'enterpriseSize':
          this._enterpriseSizeModel = $event.value;
          this.updateEnterpriseValues('enterpriseSize', this._enterpriseSizeModel, 'Enterprise Size');
          break;
        case 'enterpriseType':
          this._enterpriseTypeModel = $event.value;
          this._enterpriseTypes[0] = $event.value;
          this.updateEnterpriseValues('enterpriseType', this._enterpriseTypeModel, 'Type');
          break;
      }
    }
  }

  updateEnterpriseValues(attr: string, value: any, name: string) {
    if (value !== '' || value.length > 0) {
      this._companiesTable._content.map(item => {
        item[attr] = value;
      });
      const columnToUpdate = this._companiesTable._columns.find(c => c._name === name);
      this.addStyleToColumn(columnToUpdate);
    }
  }

  removeEnterpriseValue(attr: string, value: any, name: string) {
    this._companiesTable._content.map(item => {
      item[attr] = value;
    });
    const columnToUpdate = this._companiesTable._columns.find(c => c._name === name);
    this.removeStyleToColumn(columnToUpdate);
  }

  removeStyleToColumn(c: Column) {
    c._color = '';
    c._isFilled = undefined;
  }

  addStyleToColumn(c: Column) {
    c._color = '#EA5858';
    c._isFilled = true;
  }


  get industries(): Array<any> {
    return this._industries;
  }

  get brands(): Array<any> {
    return this._brands;
  }

  get patterns(): Array<any> {
    return this._patterns;
  }

  get geoZones(): Array<any> {
    return this._geoZones;
  }

  get valueChains(): Array<any> {
    return this._valueChains;
  }

  getContext(type: string, list: any[]) {
    return {
      type: type,
      answerList: list
    };
  }

  get patternConfig(): any {
    return {
      placeholder: 'Enter the enterprise pattern',
      initialData: []
    };
  }

  get brandConfig(): any {
    return {
      placeholder: 'Enter the enterprise brand',
      initialData: []
    };
  }

  get geoConfig(): any {
    return {
      placeholder: 'Enter the geographical zone',
      initialData: []
    };
  }

  geoZoneUpdate($event: any) {
    $event.value.map((text: any) => {
      if (this._geoZones.length === 0 || this._geoZones.find(item => item.name === text.text) === undefined) {
        this._geoZones.push({scope: 'country', name: text.text});
        this.updateEnterpriseValues('geographicalZone', this._geoZones, 'Geographical Zone');
      }
    });
  }

  brandUpdate($event: any) {
    $event.value.map((text: any) => {
      if (this._brands.length === 0 || this._brands.find(item => item.label === text.text) === undefined) {
        this._brands.push({label: text.text, url: ''});
        this.updateEnterpriseValues('brands', this._brands, 'Brand');
      }
    });
  }

  deleteItem(type: any, answer: any) {
    switch (type) {
      case 'industry':
        this._industries = this._industries.filter(item => item.code !== answer.code);
        this.removeEnterpriseValue('industries', this._industries, 'Industry');
        break;
      case 'valueChain':
        this._valueChains = this._valueChains.filter(item => item !== answer);
        this.removeEnterpriseValue('valueChain', this._valueChains, 'Value chain');
        break;
      case 'enterpriseType':
        this.enterpriseTypeModel = '';
        this._enterpriseTypes = [];
        this.removeEnterpriseValue('enterpriseType', this._enterpriseTypeModel, 'Type');
        break;
      case 'brand':
        this._brands = this._brands.filter(item => item.label !== answer.label);
        this.removeEnterpriseValue('brands', this._brands, 'Brand');
        break;
      case 'geoZone':
        this._geoZones = this._geoZones.filter(item => item.name !== answer.name);
        this.removeEnterpriseValue('geographicalZone', this._geoZones, 'Geographical Zone');
        break;
    }
  }

  resetFormValues() {
    this._enterpriseTypeModel = '';
    this._enterpriseUrlModel = '';
    this._enterpriseSizeModel = '';
    this._industries = [];
    this._brands = [];
    this._geoZones = [];
    this._valueChains = [];
    this._isOldValue = false;
  }
}
