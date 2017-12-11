import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { SmartQueryService } from '../../../../services/smartQuery/smartQuery.service';

@Component({
  selector: 'app-client-my-projects',
  templateUrl: './client-my-projects.component.html',
  styleUrls: ['./client-my-projects.component.scss']
})
export class ClientMyProjectsComponent implements OnInit {

  private _projects: [any];
  public selectedProjectIdToBeDeleted: any = null;
  private _total: number;

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _titleService: TranslateTitleService,
              private _sq: SmartQueryService) {
    this._sq.setRoute('/user/me/innovations');
  }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('MY_PROJECTS.TITLE');
    this._sq.data$.subscribe(innovations => {
      this._projects = innovations.result;
      this._total = innovations._metadata.totalCount;
    });
    this._sq.getData();
  }
  
  get sq(): any {
    return this._sq;
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
