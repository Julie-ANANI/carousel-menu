import {Component, EventEmitter, OnInit, Output} from '@angular/core';
//import {Table} from "../../../../../table/models/table";
//import { Innovation } from "../../../../../../models/innovation";
//import { InnovationService } from "../../../../../../services/innovation/innovation.service";
//import {Router} from "@angular/router";
import {TranslateTitleService} from "../../../../../../services/title/title.service";
import {first} from "rxjs/operators";
import { AdvSearchService } from "../../../../../../services/advsearch/advsearch.service";

@Component({
  selector: 'app-admin-community-projects',
  templateUrl: './admin-community-projects.component.html',
  styleUrls: ['./admin-community-projects.component.scss']
})

export class AdminCommunityProjectsComponent implements OnInit {

  private _tableInfos: any = null;

  private _config: any;

  @Output() forceParentReload = new EventEmitter <any>();

  constructor(//private _innovationService: InnovationService,
              private _advSearch: AdvSearchService,
              //private _router: Router,
              private _translateTitleService: TranslateTitleService) {
    this._config = {
      fields: '',
      limit: '10',
      offset: '0',
      search: '{}',
      status: "EVALUATING",
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
        {_attrs: ['innovation.name'], _name: 'TABLE.HEADING.TITLE', _type: 'TEXT'},
        {_attrs: ['innovation.created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE'},
        {
          _attrs: ['nbAmbassadors', 'nbRecAmbassadors'],
          _name: 'Ambassador count / Suggested',
          _type: 'MULTI-LABEL', _multiLabels: [ {_attr: 'nbAmbassadors', _class: 'label label-success'}, {_attr: 'nbRecAmbassadors', _class: 'label label-meta'} ],
          _isSortable: false
        },
        {
          _attrs: ['nbAnswers', 'nbAnswersFromAmbassadors'],
          _name: 'Feedback / From ambassador',
          _type: 'MULTI-LABEL', _multiLabels: [ {_attr: 'nbAnswers', _class: 'label label-success'}, {_attr: 'nbAnswersFromAmbassadors', _class: 'label label-meta'} ],
          _isSortable: false
        },
        {_attrs: ['innovation.status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES',
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
    this._advSearch.getCommunityInnovations(this._config).pipe(first())
      .subscribe(projects=>{
        this.setTableContent(projects, projects.length);
      }, err=>{
        console.error(err);
      }, ()=>{
        console.log("DONE");
      });
  }


  public setTableContent(projects: Array<any>, total: number) {
    const tableInfos = this._tableInfos;
    tableInfos._content = projects;
    tableInfos._total = total;
    this._tableInfos = JSON.parse(JSON.stringify(tableInfos));
  }

  public loadProjects(event: Event) {
    console.log(event);
  }

  public goToProject(event: Event) {
    console.log(event);
  }


  get config() {
    return this._config;
  }

  get tableInfos() {
    return this._tableInfos;
  }
}
