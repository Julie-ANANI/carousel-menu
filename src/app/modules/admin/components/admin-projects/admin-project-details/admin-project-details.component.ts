import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../models/innovation';
import { InnovationSettings } from '../../../../../models/innov-settings';
import { Preset } from '../../../../../models/preset';

@Component({
  selector: 'app-admin-project-details',
  templateUrl: 'admin-project-details.component.html',
  styleUrls: ['admin-project-details.component.scss']
})
export class AdminProjectsDetailsComponent implements OnInit {

  private _project: Innovation;
  private _preset: Array<Preset> = [];
  private _tabs: Array<string> = ['settings', 'cards', 'campaigns', 'synthesis', 'mail_config'];
  private _currentPage = 'settings';

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
    this._preset = this._project.preset ? [this._project.preset] : [];
  }

  get innovationTitle(): string {
    return this._project.name || 'Untitled';
  }

  set preset(value: Array<Preset>) { this._preset = value; }
  get preset() { return this._preset; }

  public updatePreset(event: {value: Array<Preset>}) {
    this._preset = event.value;
    this._project.preset = this._preset[0];
  }

  public updateSettings(value: InnovationSettings) {
    this._project.settings = value;
  }

  public generateQuiz() {
    this._innovationService
      .createQuiz(this._project._id)
      .first()
      .subscribe(() => {
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE' , 'ERROR.QUIZ.CREATED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
      });
  }

  /**
   * Sauvegarde
   */
  public save() {
    this._innovationService
      .save(this._project._id, this._project)
      .first()
      .subscribe(data => {
        this._project = data;
      }, err => {
        this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
  }


  /**
   * Suppression et mise à jour de la vue
   */
  /*public removeProject(projectId: string) {
    this._innovationService
      .remove(projectId)
      .subscribe(projectRemoved => {
        this._projects.splice(this._getProjectIndex(projectId), 1);
        this.selectedProjectIdToBeDeleted = null;
      });
  }*/

  public getPrincipalMedia(project: Innovation): string {
    if (project.principalMedia) {
      if (project.principalMedia.type === 'PHOTO') {
        return 'https://res.cloudinary.com/umi/image/upload/c_scale,h_260,w_260/' + project.principalMedia.cloudinary.public_id;
      } else {
        return project.principalMedia.video.thumbnail;
      }
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/no-image.png';
    }
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }
  get baseUrl(): string { return `/admin/projects/project/${this._project._id}/`; }
  get tabs(): Array<string> { return this._tabs; }
  get currentPage() { return this._currentPage; }
  get project() { return this._project; }
}
