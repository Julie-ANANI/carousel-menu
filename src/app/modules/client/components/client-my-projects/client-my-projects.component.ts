import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { UserService } from '../../../../services/user/user.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../models/innovation';

@Component({
  selector: 'app-client-my-projects',
  templateUrl: './client-my-projects.component.html',
  styleUrls: ['./client-my-projects.component.scss']
})
export class ClientMyProjectsComponent implements OnInit {

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

  constructor(private _translateService: TranslateService,
              private _userService: UserService,
              private _innovationService: InnovationService,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('MY_PROJECTS.TITLE');
    this.loadProjects(this._config);
  }

  loadProjects(config: any): void {
    this._config = config;
    this._userService.getMyInnovations(this._config)
      .first()
      .subscribe(projects => {
        this._projects = projects.result;
        this._total = projects._metadata.totalCount;
      });
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removeProject(projectId: string): void {
    this._innovationService
      .remove(projectId)
      .first()
      .subscribe(projectRemoved => {
        this._projects.splice(this._getProjectIndex(projectId), 1);
        this.selectedProjectIdToBeDeleted = null;
      });
  }

  public getRelevantLink(project: Innovation): string { // routerLink : /projects/:project_id
    const link = './' + project._id;
    switch (project.status) {
      case 'DONE':
      case 'EVALUATING':
        return link + '/synthesis';
      case 'SUBMITTED':
        return link;
      default:
        return link + '/edit';
    }
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
}
