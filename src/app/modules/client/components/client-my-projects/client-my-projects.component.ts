import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user/user.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { MediaService } from '../../../../services/media/media.service';
import { TranslateService, initTranslation } from './i18n/i18n';

@Component({
  selector: 'app-client-my-projects',
  templateUrl: './client-my-projects.component.html',
  styleUrls: ['./client-my-projects.component.scss']
})
export class ClientMyProjectsComponent implements OnInit {

  private _projects: [any];
  public selectedProjectIdToBeDeleted: any = null;
  public sortAsc = false;

  constructor(private _translateService: TranslateService,
              private _userService: UserService,
              private _innovationService: InnovationService,
              private _titleService: Title,
              private _mediaService: MediaService) { }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('My projects'); // TODO translate
    this._userService.getMyInnovations().subscribe(projects => {
      this._projects = projects.innovations;
      this.sortProjectsBy('created');
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
    if (project.media) {
      return this._mediaService.buildUrl(project.media.id);
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/no-image.png';
    }
  }

  public sortProjectsBy(sortBy) {
    this.sortAsc = !this.sortAsc;

    const getValue  = (item) => {
      switch (sortBy) {
        case 'owner.companyName':
          return item.owner.companyName.toLowerCase();
        case 'owner.name':
          return item.owner.name.toLowerCase();
        default:
          return item[sortBy].toLowerCase();
      }
    };

    this._projects = this._projects.sort((a, b) => {
      a = getValue(a);
      b = getValue(b);
      if (this.sortAsc) {
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }
      else {
        return (a > b) ? -1 : (a < b) ? 1 : 0;
      }
    });
  }

  get projects () { // TODO     : Project[] { (using server)
    return this._projects;
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }
}
