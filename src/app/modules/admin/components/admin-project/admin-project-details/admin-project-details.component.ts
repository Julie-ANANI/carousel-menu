import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class AdminProjectDetailsComponent implements OnInit {

  private _project: Innovation;
  private _tags: Array<any> = [];
  private _dirty = false;
  private _domain = {fr: '', en: ''};

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _notificationsService: TranslateNotificationsService,
              private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('MY_PROJECTS.TITLE');
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
    this._domain = this._project.settings.domain;
    this._tags = this._project.tags.map(tag => {
      return {name: tag.label, _id: tag.id}
    });
  }

  set tags(value: Array<any>) {
    this._tags = value;
    this._dirty = true;
  }

  get tags(): Array<any> {
    return this._tags;
  }

  public updateTags(event: {value: Array<any>}): void {
    this._tags = event.value;
    this._project.tags = this._tags;
    this._dirty = true;
  }

  public updatePreset(event: {value: Array<Preset>}): void {
    this._project.preset = event.value[0];
    this._dirty = true;
  }

  public updateSettings(value: InnovationSettings): void {
    this._project.settings = value;
    this._dirty = true;
  }

  public generateQuiz(event: Event): void {
    event.preventDefault();
    this._innovationService
      .createQuiz(this._project._id)
      .first()
      .subscribe((p) => {
        this._project = p;
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE' , 'ERROR.QUIZ.CREATED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
      });
  }

  /**
   * Sauvegarde
   */
  public save(event: Event): void {
    event.preventDefault();
    this._innovationService
      .save(this._project._id, this._project)
      .first()
      .subscribe(data => {
        this._project = data;
        this._dirty = false;
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

  public hasPreset(): boolean {
    const p = this._project.preset;
    return (p && p.constructor === Object && Object.keys(p).length > 0);
  }

  public notifClass(): string {
    if (this._dirty) {
      return 'btn btn-primary input-group-btn btn-lg badge';
    } else {
      return 'btn btn-primary input-group-btn btn-lg';
    }
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  public updateDomain() {
    console.log(this._domain);
    this._innovationService.updateSettingsDomain(this._project._id, this._domain).first().subscribe( x => {
      this._domain = x.domain;
    }, (error) => {
      this._notificationsService.error('ERROR', error);
    });
  }
  set domain(domain: {en: string, fr: string}) { this._domain = domain; }
  get domain() { return this._domain; }
  get project() { return this._project; }
  get dirty() { return this._dirty; }
}
