import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Table} from '../../../../../../table/models/table';
import {RolesFrontService} from '../../../../../../../services/roles/roles-front.service';
import {Config} from '../../../../../../../models/config';
import {LocalStorageService} from '../../../../../../../services/localStorage/localStorage.service';
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

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _rolesFrontService: RolesFrontService,
              private _router: Router,
              private _localStorageService: LocalStorageService) {
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
      _title: 'Company/Companies selected',
      _content: this.companiesToEdit,
      _total: this.companiesToEdit.length,
      _isTitle: true,
      _isSearchable: !!this.canAccess(['searchBy']),
      _isSelectable: this.canAccess(['delete']),
      _isPaginable: this.companiesToEdit.length > 10,
      _isDeletable: this.canAccess(['delete']),
      _isNoMinHeight: this.companiesToEdit.length < 11,
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


}
