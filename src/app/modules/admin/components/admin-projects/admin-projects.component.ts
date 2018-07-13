import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService } from '@ngx-translate/core';
import { Innovation } from '../../../../models/innovation';
import {Table} from '../../../shared/components/shared-table/models/table';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})
export class AdminProjectsComponent implements OnInit {

  private _projects: Array<Innovation>;
  public selectedProjectIdToBeDeleted: any = null;
  private _total: number;
  private _tableInfos: Table = null;
  private _config = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private router: Router,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('MY_PROJECTS.TITLE');
    this.loadProjects(this._config);
  }

  loadProjects(config: any): void {
    this._config = config;
    this._innovationService.getAll(this._config)
      .first()
      .subscribe(projects => {
        this._projects = projects.result;
        this._total = projects._metadata.totalCount;

        this._tableInfos = {
          _selector: 'admin-projects',
          _title: 'COMMON.PROJECTS',
          _content: this._projects,
          _total: this._total,
          _isHeadable: true,
          _isFiltrable: true,
          _isShowable: true,
          _columns: [
            {_attrs: ['owner.firstName', 'owner.lastName'], _name: 'COMMON.NAME', _type: 'TEXT', _isSortable: false},
            {_attrs: ['name'], _name: 'COMMON.COMPANY', _type: 'TEXT'},
            {_attrs: ['created'], _name: 'COMMON.SORT.BY_CREATION_DATE', _type: 'DATE'},
            {_attrs: ['updated'], _name: 'COMMON.SORT.BY_UPDATE_DATE', _type: 'DATE'},
            {_attrs: ['status'], _name: 'Status', _type: 'MULTI-CHOICES', _choices: [
                {_name: 'EDITING', _class: 'label-editing'},
                {_name: 'SUBMITTED', _class: 'label-draft'},
                {_name: 'EVALUATING', _class: 'label-progress'},
                {_name: 'DONE', _class: 'label-validate'},
              ]}
          ]
        };
      });
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removeProject(event: Event, projectId: string) {
    event.preventDefault();
    this._innovationService
      .remove(projectId)
      .first()
      .subscribe(_ => {
        this._projects.splice(this._getProjectIndex(projectId), 1);
        this.selectedProjectIdToBeDeleted = null;
      });
  }

  public getRelevantLink (project: Innovation) { // routerLink : /projects/:project_id
    return 'project/' + project._id;
  }

  goToProject(project: Innovation) {
    this.router.navigate(['/admin/projects/' + this.getRelevantLink(project)]);
  }

  private _getProjectIndex(projectId: string): number {
    for (const project of this._projects) {
      if (projectId === project._id) {
        return this._projects.indexOf(project);
      }
    }
  }

  public getPrincipalMedia(project: Innovation): string {
    if (project.principalMedia) {
      if (project.principalMedia.type === 'PHOTO') {
        return 'https://res.cloudinary.com/umi/image/upload/c_scale,h_260,w_260/' + project.principalMedia.cloudinary.public_id;
      }
      else {
        return project.principalMedia.video.thumbnail;
      }
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/no-image.png';
    }
  }

  set config(value: any) { this._config = value; }
  get config() { return this._config; }
  get total () { return this._total; }
  get projects () { return this._projects; }
  get tableInfos() { return this._tableInfos; }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
}
