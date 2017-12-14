import { Component, OnInit, Input } from '@angular/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-projects-list',
  templateUrl: './admin-projects-list.component.html',
  styleUrls: ['./admin-projects-list.component.scss']
})
export class AdminProjectsListComponent implements OnInit {

  @Input() status: string;
  private _projects: [any];
  public selectedProjectIdToBeDeleted: any = null;
  private _total: number;
  private _config: any;

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService) {}

  ngOnInit(): void {
    this._config = {
      fields: '',
      limit: 5,
      offset: 0,
      search: {},
      sort: {
        created: -1
      }
    };
    this._config.status = this.status;
    this.loadProjects(this._config);
  }

  loadProjects(config: any): void {
    this._config = config;
    this._innovationService.getAll(this._config).subscribe(projects => {
      this._projects = projects.result;
      this._total = projects._metadata.totalCount;
    });
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removeProject(projectId) {
    this._innovationService
      .remove(projectId)
      .subscribe(projectRemoved => {
        this._projects.splice(this._getProjectIndex(projectId), 1);
        this.selectedProjectIdToBeDeleted = null;
      });
  }

  public getRelevantLink (project) { // routerLink : /projects/:project_id
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

  public getPrincipalMedia(project): string {
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
