import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { UserService } from '../../../../../services/user/user.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { TranslateService } from '@ngx-translate/core';
import {NotificationsService} from "angular2-notifications/dist";

@Component({
  selector: 'app-admin-project-details',
  templateUrl: 'admin-project-details.component.html',
  styleUrls: ['admin-project-details.component.scss']
})
export class AdminProjectsDetailsComponent implements OnInit {

  private _projectInformation: any = {};

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _notificationsService: NotificationsService,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('MY_PROJECTS.TITLE');
    this._activatedRoute.params.subscribe(params => {

      this._innovationService.get(params.projectId)
          .subscribe(innovation => {
                this._projectInformation = innovation;
              },
              error => this._notificationsService.error('ERROR', error.message)
          );
    });
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
}
