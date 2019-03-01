import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Table} from "../../../../../table/models/table";
import {Innovation} from "../../../../../../models/innovation";
import {InnovationService} from "../../../../../../services/innovation/innovation.service";
//import {Router} from "@angular/router";
import {TranslateTitleService} from "../../../../../../services/title/title.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-admin-community-projects',
  templateUrl: './admin-community-projects.component.html',
  styleUrls: ['./admin-community-projects.component.scss']
})

export class AdminCommunityProjectsComponent implements OnInit {

  private _tableInfos: Table = null;

  private _config: any;

  @Output() forceParentReload = new EventEmitter <any>();

  constructor(private _innovationService: InnovationService,
              //private _router: Router,
              private _translateTitleService: TranslateTitleService) {
    this._config = {
      fields: '',
      limit: '10',
      offset: '0',
      search: '{"status":"EVALUATING"}',
      sort: '{"created":-1}'
    };
    this._tableInfos = {
      _selector: 'admin-projects',
      _title: 'TABLE.TITLE.PROJECTS',
      _content: [],
      _total: 0,
      _isHeadable: true,
      _isFiltrable: true,
      _isShowable: true,
      _columns: [
        {_attrs: ['name'], _name: 'TABLE.HEADING.TITLE', _type: 'TEXT'},
        {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE'},
        {_attrs: ['status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES',
          _choices: [
            {_name: 'EDITING', _alias: 'Editing', _class: 'label label-edit'},
            {_name: 'SUBMITTED', _alias: 'Submitted',  _class: 'label label-draft'},
            {_name: 'EVALUATING', _alias: 'Evaluating',  _class: 'label label-progress'},
            {_name: 'DONE', _alias: 'Done', _class: 'label label-success'},
          ]}
      ]
    };
  }

  ngOnInit() {
    this._translateTitleService.setTitle('COMMON.PROJECTS');
    this._innovationService.getAll(this._config).pipe(first()).subscribe(projects=>{
      this.setTableContent(projects.result, projects._metadata.totalCount);
    }, error=>{
      console.error(error);
    }, ()=>{
      console.log("DONE");
    })
  }


  public setTableContent(projects: Array<Innovation>, total: number) {
    const tableInfos = this._tableInfos;
    tableInfos._content = projects;
    tableInfos._total = total;
    this._tableInfos = JSON.parse(JSON.stringify(tableInfos));
  }


  get config() {
    return this._config;
  }

  get tableInfos() {
    return this._tableInfos;
  }
}
