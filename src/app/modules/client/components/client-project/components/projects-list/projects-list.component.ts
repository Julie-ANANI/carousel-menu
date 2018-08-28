import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { UserService } from '../../../../../../services/user/user.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import {ConfigTemplate} from '../../../../../../models/config';

@Component({
  selector: 'app-projects-list',
  templateUrl: 'projects-list.component.html',
  styleUrls: ['projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {

  private _projects: Array<Innovation>;
  public selectedProjectIdToBeDeleted: any = null;
  private _total: number;
  private _config = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  private _paginationConfig: ConfigTemplate = {limit: this._config.limit, offset: this._config.offset};

  constructor(private _translateService: TranslateService,
              private _userService: UserService,
              private _innovationService: InnovationService,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('PROJECT_MODULE.PROJECTS_LIST.TITLE');
    this.loadProjects();
  }

  loadProjects(): void {
    this._userService.getMyInnovations(this._config)
      .first()
      .subscribe(projects => {
        this._projects = projects.result;
        this._total = projects._metadata.totalCount;
      });
  }

  configChange(value: any) {
    this._paginationConfig = value;
    this._config.limit = value.limit
    this._config.offset = value.offset;
    window.scroll(0, 0);
    this.loadProjects();
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removeProject(event: Event, projectId: string): void {
    event.preventDefault();
    this._innovationService
      .remove(projectId)
      .first()
      .subscribe(_ => {
        this._projects.splice(this._getProjectIndex(projectId), 1);
        this.selectedProjectIdToBeDeleted = null;
      });
  }

  public getRelevantLink(project: Innovation): Array<string> { // routerLink : /project/:project_id
    const link = ['/project', project._id];
    switch (project.status) {
      case 'DONE':
        link.push('synthesis');
        break;
      case 'EVALUATING':
        link.push('exploration');
        break;
      default:
        link.push('setup');
    }
    return link;
  }

  private _getProjectIndex(projectId: string): number {
    return this._projects.findIndex((x) => x._id === projectId);
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

  set config(value: any) {
    this._config = value;
  }

  get config(): any {
    return this._config;
  }

  get total () {
    return this._total;
  }

  get projects () {
    return this._projects;
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get paginationConfig(): ConfigTemplate {
    return this._paginationConfig;
  }
}
