import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { TranslateService } from '@ngx-translate/core';
import { ISubscription } from "rxjs/Subscription";
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-admin-project-details',
  templateUrl: 'admin-project-details.component.html',
  styleUrls: ['admin-project-details.component.scss']
})
export class AdminProjectsDetailsComponent implements OnInit {

  private _project: any = {};
  private _preset: any;
  private _tabs = ['settings', 'cards', 'campaigns', 'synthesis', 'mail_config'];
  private _currentPage = 'settings';
  private _subscriptions: Array<ISubscription> = [];

  constructor(private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _notificationsService: TranslateNotificationsService,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('MY_PROJECTS.TITLE');
    this._project = this._activatedRoute.snapshot.data['innovation'];
    const url = this._router.routerState.snapshot.url.split('/');
    if (url && url[5]) { this._currentPage = url[5]; }
    this._preset = [this._project.preset];
  }

  get innovationTitle(): string {
    return this._project.name || 'Untitled';
  }

  set preset(value: any) { this._preset = value; }
  get preset(): any { return this._preset; }
  
  public updatePreset(event) {
    this._preset = event.value;
    this._project.preset = this._preset[0];
  }

  public updateSettings(value) {
    this._project.settings = value;
  }

  /**
   * Sauvegarde
   */
  public save() {
    const saveSubs = this._innovationService
      .save(this._project.id, this._project)
      .subscribe(data => {
        this._project = data;
      }, err => {
        this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
    this._subscriptions.push(saveSubs);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subs=>{
      subs.unsubscribe();
    });
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
  get baseUrl(): any { return `/admin/projects/project/${this._project._id}/`; }
  get tabs(): any { return this._tabs; }
  get currentPage() { return this._currentPage; }
  get project() { return this._project; }
}
