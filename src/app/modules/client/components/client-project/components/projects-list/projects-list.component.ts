import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { UserService } from '../../../../../../services/user/user.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import {FrontendService} from '../../../../../../services/frontend/frontend.service';

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

  constructor(private translateService: TranslateService,
              private userService: UserService,
              private innovationService: InnovationService,
              private translateTitleService: TranslateTitleService,
              private frontendService: FrontendService) {}

  ngOnInit(): void {
    this.translateTitleService.setTitle('PROJECT_MODULE.PROJECTS_LIST.TITLE');
    this.loadProjects();
  }

  loadProjects(): void {
    this.userService.getMyInnovations(this._config)
      .first()
      .subscribe(projects => {
        this._projects = projects.result;
        this._total = projects._metadata.totalCount;
      });
  }

  configChange(config: any) {
    const _configChange = this.frontendService.compareObject(this._config, config);

    if (_configChange) {
      this._config = config;
      this.loadProjects();
      window.scroll(0, 0);
    }

  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removeProject(event: Event, projectId: string): void {
    event.preventDefault();
    this.innovationService
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
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }
}
