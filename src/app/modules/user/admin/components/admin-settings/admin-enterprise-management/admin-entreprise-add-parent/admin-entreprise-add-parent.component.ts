import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {Table} from '../../../../../../table/models/table';
import {RolesFrontService} from '../../../../../../../services/roles/roles-front.service';
import {Config} from '../../../../../../../models/config';
import {LocalStorageService} from '../../../../../../../services/localStorage/localStorage.service';
// import {SwellrtBackend} from "../swellrt-client/services/swellrt-backend";
// import {UserService} from "../../services/user/user.service";

// declare let swellrt;

@Component({
  templateUrl: './admin-entreprise-add-parent.component.html',
  styleUrls: ['./admin-entreprise-add-parent.component.scss']
})

export class AdminEntrepriseAddParentComponent implements OnInit {
  private _companiesToAddParent: Array<any> = [];
  private _companiesTable: Table = <Table>{};
  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };
  private _data: any = [];
  configCompany = {
    placeholder: 'test',
    initialData: this._data,
    type: 'company',
    showDomain: true
  };


  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _router: Router,
              private _rolesFrontService: RolesFrontService,
              private _localStorageService: LocalStorageService) {
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
    this._companiesToAddParent = JSON.parse(this._localStorageService.getItem('companiesSelected'));
    if (this.companiesToAddParent) {
      this._initTable();
    } else {
      this._router.navigate(['/user/admin/settings/enterprises']);
    }
  }

  _initTable() {
    this._companiesTable = {
      _selector: 'admin-enterprises-bulk-edit-table',
      _title: this.companiesToAddParent.length > 1 ? 'Companies selected' : 'Company selected',
      _content: this.companiesToAddParent,
      _total: this.companiesToAddParent.length,
      _isTitle: true,
      _isSelectable: this.canAccess(['delete']),
      _isPaginable: this.companiesToAddParent.length > 10,
      _isDeletable: this.canAccess(['delete']),
      _isNoMinHeight: this.companiesToAddParent.length < 11,
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
          _attrs: ['topLevelDomain'],
          _name: 'Domain',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: true,
          _isHidden: !this.canAccess(['tableColumns', 'domain'])
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

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'enterprises'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'enterprises']);
    }
  }


  addCompanyToInclude(event: { value: Array<string> }): void {
    // this._innovation.settings.companies.include = event.value;
    // this.updateSettings();
    console.log(event);

  }
}
