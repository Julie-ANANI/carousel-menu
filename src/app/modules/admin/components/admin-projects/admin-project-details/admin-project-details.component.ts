import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { UserService } from '../../../../../services/user/user.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from "angular2-notifications/dist";

@Component({
  selector: 'app-admin-project-details',
  templateUrl: 'admin-project-details.component.html',
  styleUrls: ['admin-project-details.component.scss']
})
export class AdminProjectsDetailsComponent implements OnInit {

  private _projectInformation: any = {};
  private _tabs = ['settings', 'cards', 'campaigns', 'synthesis', 'mail_config'];
  private _currentPage = 'settings';

  constructor(private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _notificationsService: NotificationsService,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('MY_PROJECTS.TITLE');
    this._projectInformation = this._activatedRoute.snapshot.data['innovation'];
    const url = this._router.routerState.snapshot.url.split('/');
    if (url && url[5]) this._currentPage = url[5];
  }

  get innovationTitle(): string {
    return this._projectInformation.name || "Untitled";
  }

  get projectSettings(): any {
    return this._projectInformation.settings;
  }

  set projectSettings(_settings: any) {
    this._projectInformation.settings = _settings;
  }



  /**
   * Suppression et mise à jour de la vue
   */
  public removeProject(projectId) {
    /*this._innovationService
      .remove(projectId)
      .subscribe(projectRemoved => {
        this._projects.splice(this._getProjectIndex(projectId), 1);
        this.selectedProjectIdToBeDeleted = null;
      });*/
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

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }
  get baseUrl(): any { return `/admin/projects/project/${this._projectInformation._id}/`; }
  get tabs(): any { return this._tabs; }
  get currentPage() { return this._currentPage; }
  get project() { return this._projectInformation; }
}
