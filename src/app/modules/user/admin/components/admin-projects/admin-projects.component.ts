import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../models/innovation';
import { Table } from '../../../../table/models/table';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})

export class AdminProjectsComponent implements OnInit {

  private _projects: Array<Innovation>;

  private _total: number;

  private _tableInfos: Table = null;

  private _config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  constructor(private innovationService: InnovationService,
              private router: Router,
              private translateTitleService: TranslateTitleService) { }

  ngOnInit(): void {
    this.translateTitleService.setTitle('COMMON.PROJECTS');
    this.loadProjects(this._config);
  }


  loadProjects(config: any): void {
    this._config = config;

    this.innovationService.getAll(this._config).pipe(first()).subscribe((projects: any) => {
      this._projects = projects.result;
      this._total = projects._metadata.totalCount;

      this._tableInfos = {
        _selector: 'admin-projects',
        _title: 'TABLE.TITLE.PROJECTS',
        _content: this._projects,
        _total: this._total,
        _isFiltrable: true,
        _isShowable: true,
        _isEditable: false,
        _editIndex: 1,
        _columns: [
          {_attrs: ['name'], _name: 'TABLE.HEADING.TITLE', _type: 'TEXT'},
          {_attrs: ['owner.firstName', 'owner.lastName'], _name: 'TABLE.HEADING.OWNER', _type: 'TEXT', _isSortable: false, _isFiltrable: false},
          {_attrs: ['domain'], _name: 'TABLE.HEADING.DOMAIN', _type: 'TEXT'},
          {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE'},
          {_attrs: ['updated'], _name: 'TABLE.HEADING.UPDATED', _type: 'DATE'},
          {_attrs: ['status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES',
            _choices: [
              {_name: 'EDITING', _alias: 'Editing', _class: 'label label-edit'},
              {_name: 'SUBMITTED', _alias: 'Submitted',  _class: 'label label-draft'},
              {_name: 'EVALUATING', _alias: 'Evaluating',  _class: 'label label-progress'},
              {_name: 'DONE', _alias: 'Done', _class: 'label label-success'},
            ]}
          ]
        };
      });
  }


  goToProject(project: Innovation) {
    this.router.navigate(['/user/admin/projects/project/' + project._id]);
  }


  set config(value: any) {
    this._config = value;
  }

  get config() {
    return this._config;
  }

  get total () {
    return this._total;
  }

  get projects () {
    return this._projects;
  }

  get tableInfos() {
    return this._tableInfos;
  }

}
