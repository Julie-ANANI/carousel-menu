import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { EnterpriseService } from '../../../../../../../services/enterprise/enterprise.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import {
  EnterpriseSizeList,
  EnterpriseTypes,
  EnterpriseValueChains,
  Industries
} from '../../../../../../../models/static-data/enterprise';
import { Column, Table, UmiusAutoSuggestionInterface, UmiusConfigInterface } from '@umius/umi-common-component';

@Component({
  templateUrl: './admin-entreprise-bulk-edit.component.html',
  styleUrls: ['./admin-entreprise-bulk-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdminEntrepriseBulkEditComponent implements OnInit {
  private _industrySelectConfig: UmiusAutoSuggestionInterface = {
    minChars: 1,
    placeholder: 'Enter the industry',
    type: 'industry',
    identifier: '',
    isShowAddButton: true,
    suggestionList: Industries,
    requestType: 'local'
  };

  private _valueChainSelectConfig: UmiusAutoSuggestionInterface = {
    minChars: 1,
    placeholder: 'Enter the value chain',
    type: 'valueChain',
    identifier: '',
    isShowAddButton: true,
    suggestionList: EnterpriseValueChains,
    requestType: 'local'
  };

  private _enterpriseSizeSelectConfig: UmiusAutoSuggestionInterface = {
    minChars: 0,
    placeholder: 'Enter the size',
    type: 'enterpriseSize',
    identifier: '',
    isShowAddButton: false,
    suggestionList: EnterpriseSizeList,
    requestType: 'local',
    showSuggestionFirst: true,
  };

  private _enterpriseTypeSelectConfig: UmiusAutoSuggestionInterface = {
    minChars: 0,
    placeholder: 'Enter the type',
    type: 'enterpriseType',
    identifier: '',
    isShowAddButton: true,
    suggestionList: EnterpriseTypes,
    requestType: 'local',
    showSuggestionFirst: true
  };

  private _companiesToEdit: Array<any> = [];
  private _companiesTable: Table = <Table>{};
  private _companiesOriginalTable: Table = <Table>{};
  private _companiesTableToSwap: Table = <Table>{};
  private _config: UmiusConfigInterface = {
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
  private _isSizeInfo = false;
  private _isShowSyntax = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _rolesFrontService: RolesFrontService,
              private _router: Router,
              private _changeDetectorRef: ChangeDetectorRef,
              private _notificationService: NotificationsService,
              private _enterpriseService: EnterpriseService) {
  }

  ngOnInit(): void {
    this.companiesToEdit = this._enterpriseService._enterprisesSelected;
    this._initTable();
  }

  _initTable() {
    this._companiesTable = {
      _selector: 'admin-enterprises-bulk-edit-table',
      _title: this.companiesToEdit.length > 1 ? 'Companies selected' : 'Company selected',
      _content: this.companiesToEdit,
      _total: this.companiesToEdit.length,
      _isTitle: true,
      _isPaginable: this.companiesToEdit.length > 10,
      _isNoMinHeight: this.companiesToEdit.length < 11,
      _paginationTemplate: 'TEMPLATE_1',
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
            _isHidden: !this.canAccess(['tableColumns', 'name']),
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
            _isHidden: !this.canAccess(['tableColumns', 'geoZone']),
            _width: '190px',
          },
          {
            _attrs: ['enterpriseSize'],
            _name: 'Enterprise size',
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
        ]
    };
    this._companiesTable._content.map(item => {
      item._isSelected = false;
    });
    this._companiesOriginalTable = JSON.parse(JSON.stringify(this._companiesTable));
    this._companiesTableToSwap = JSON.parse(JSON.stringify(this._companiesTable));
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(
        ['settings', 'enterprises', 'bulkEdit'].concat(path)
      );
    } else {
      return this._rolesFrontService.hasAccessAdminSide([
        'settings',
        'enterprises',
        'bulkEdit'
      ]);
    }
  }

  /**
   * notification for users
   */
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

  /**
   *
   */
  initState() {
    this.success = 0;
    this.failed = 0;
  }

  /**
   * update the changes
   */
  updateChange() {
    this.companiesTable._content.map((item, index) => {
      this._enterpriseService.save(item._id, item,
        {
          name: this._companiesOriginalTable._content[index].name,
          domain: this._companiesOriginalTable._content[index].topLevelDomain,
        }).pipe(first()).subscribe(
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

  /**
   * click on button undo => cancel the change on one value
   * @param context
   */
  undoFilled(context: any) {
    if (context) {
      const rowIndex = context.row;
      const column = context.column;
      const tempValue = this.companiesTable._content[rowIndex][column._attrs[0]];
      this.companiesTable._content[rowIndex][column._attrs[0]]
        = this._companiesTableToSwap._content[rowIndex][column._attrs[0]];
      this._companiesTableToSwap._content[rowIndex][column._attrs[0]] = tempValue;
    }
  }

  /**
   * initialize table states after updated
   */
  removeFillTemplate() {
    this.companiesTable._columns.map(c => {
      c._textColorConfig = {
        color: '',
        condition: '',
        icon: ''
      }
    });
    this._companiesOriginalTable = JSON.parse(JSON.stringify(this._companiesTable));
  }

  return() {
    this._router.navigate(['/user/admin/settings/enterprises']);
  }

  /**
   * auto-suggestion => value selected
   * @param $event
   */
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
          if (this._valueChains.length === 0 || this._valueChains.toString().indexOf($event) === -1) {
            this._valueChains.push($event.value);
            this.updateEnterpriseValues('valueChain', this._valueChains, 'Value chain');
          }
          break;
        case 'enterpriseSize':
          this._enterpriseSizeModel = $event.value;
          this.updateEnterpriseValues('enterpriseSize', this._enterpriseSizeModel, 'Enterprise size');
          break;
        case 'enterpriseType':
          this._enterpriseTypeModel = $event.value;
          this._enterpriseTypes[0] = $event.value;
          this.updateEnterpriseValues('enterpriseType', this._enterpriseTypeModel, 'Type');
          break;
      }
    }
  }

  /**
   *
   * @param attr
   * @param value
   * @param name
   */
  updateEnterpriseValues(attr: string, value: any, name: string) {
    if (value !== '' || value.length > 0) {
      this._companiesTable._content.map(item => {
        item[attr] = value;
      });
      const columnToUpdate = this._companiesTable._columns.find(c => c._name === name);
      this.addStyleToColumn(columnToUpdate);
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   *
   * @param attr
   * @param value
   * @param name
   */
  removeEnterpriseValue(attr: string, value: any, name: string) {
    if (typeof value === 'object' && value.length === 0) {
      for (let i = 0; i < this._companiesTable._content.length - 1; i++) {
        this._companiesTable._content[i][attr] = this._companiesOriginalTable._content[i][attr];
      }
      const columnToUpdate = this._companiesTable._columns.find(c => c._name === name);
      this.removeStyleToColumn(columnToUpdate);
      this._changeDetectorRef.markForCheck();
    } else {
      this._companiesTable._content.map(item => {
        item[attr] = value;
      });
    }
  }

  removeStyleToColumn(c: Column) {
    delete c._textColorConfig
  }

  addStyleToColumn(c: Column) {
    c._textColorConfig = {
      color: '#EA5858',
      condition: 'fill',
      icon: 'fas fa-redo'
    }
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
      case 'patterns':
        this._patterns = this._patterns.filter(item => item.expression !== answer.expression);
        this.removeEnterpriseValue('patterns', this._patterns, 'Patterns');
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
    this._patterns = [];
  }

  updateUrl() {
    if (this._enterpriseUrlModel !== '') {
      this.updateEnterpriseValues('enterpriseURL', this._enterpriseUrlModel, 'Enterprise Url');
    } else {
      this.removeEnterpriseValue('enterpriseURL', this._enterpriseUrlModel, 'Enterprise Url');
    }
  }

  cancel() {
    this._companiesTable = this._companiesOriginalTable;
  }

  /**
   * update patterns
   * @param $event
   * Updated by Wei WANG 25/04/2022
   */
  patternsUpdate($event: any) {
    $event.value.map((text: any) => {
      const newPattern = text.expression || text.text;
      if (this._patterns.length === 0 || this._patterns.find(item => item.expression === newPattern) === undefined) {
        this._patterns.push({expression: newPattern, avgScore: 0});
        this.updateEnterpriseValues('patterns', this._patterns, 'Patterns');
      }
    });
  }

  getPerformAction($event: any) {
    if ($event._action === 'fill') {
      this.undoFilled($event._context);
    }
  }

  hideSizeInfo() {
    this._isSizeInfo = false;
  }

  showSizeInfo() {
    this._isSizeInfo = true;
  }

  hideSyntaxInfo() {
    this._isShowSyntax = false;
  }

  showSyntaxInfo() {
    this._isShowSyntax = true;
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

  getContext(type: string, list: any[], isString: boolean) {
    return {
      type: type,
      isString: isString,
      answerList: list
    };
  }

  get patternConfig(): any {
    return {
      placeholder: 'Enter the pattern',
      initialData: []
    };
  }

  get brandConfig(): any {
    return {
      placeholder: 'Enter the brand',
      initialData: []
    };
  }

  get geoConfig(): any {
    return {
      placeholder: '',
      initialData: []
    };
  }

  get companiesOriginalTable(): Table {
    return this._companiesOriginalTable;
  }

  get enterpriseTypes(): Array<any> {
    return this._enterpriseTypes;
  }


  get industrySelectConfig(): UmiusAutoSuggestionInterface {
    return this._industrySelectConfig;
  }

  get valueChainSelectConfig(): UmiusAutoSuggestionInterface {
    return this._valueChainSelectConfig;
  }

  get enterpriseSizeSelectConfig(): UmiusAutoSuggestionInterface {
    return this._enterpriseSizeSelectConfig;
  }

  get enterpriseTypeSelectConfig(): UmiusAutoSuggestionInterface {
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

  set config(value: UmiusConfigInterface) {
    this._config = value;
  }

  get config(): UmiusConfigInterface {
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


  get isSizeInfo(): boolean {
    return this._isSizeInfo;
  }


  get isShowSyntax(): boolean {
    return this._isShowSyntax;
  }
}
