import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../models/innovation';
import { InnovationSettings } from '../../../../../models/innov-settings';
import { Preset } from '../../../../../models/preset';
import { Tag } from '../../../../../models/tag';

@Component({
  selector: 'app-admin-project-details',
  templateUrl: 'admin-project-details.component.html',
  styleUrls: ['admin-project-details.component.scss']
})
export class AdminProjectDetailsComponent implements OnInit {

  private _project: Innovation;
  private _dirty = false;
  private _domain = {fr: '', en: ''};


  public formData: FormGroup = this._formBuilder.group({
    domainen: ['', [Validators.required]],
    domainfr: ['', [Validators.required]]
  });

  public presetAutocomplete: any;

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _notificationsService: TranslateNotificationsService,
              private _titleService: TranslateTitleService,
              private _translateService: TranslateService,
              private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this._titleService.setTitle('MY_PROJECTS.TITLE');
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
    this.presetAutocomplete = {
      placeholder: 'preset',
      initialData: this.hasPreset() ? [this.project.preset] : [],
      type: 'preset'
    };
    this._domain = this._project.settings.domain;
  }

  public addTag(tag: Tag): void {
    this._innovationService
      .addTag(this._project._id, tag._id)
      .first()
      .subscribe((p) => {
        this._project.tags.push(tag);
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
      });
  }

  public removeTag(tag: Tag): void {
    this._innovationService
      .removeTag(this._project._id, tag._id)
      .first()
      .subscribe((p) => {
        this._project.tags = this._project.tags.filter(t => t._id !== tag._id);
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
      });
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

  public notifyClass(): string {
    if (this._dirty) {
      return 'btn ghost-primary btn-lg badge';
    } else {
      return 'btn ghost-primary btn-lg';
    }
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  public updateDomain() {
    this._innovationService.updateSettingsDomain(this._project._id, this._domain).first().subscribe( x => {
      this._domain = x.domain;
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    }, (error) => {
      this._notificationsService.error('ERROR', error);
    });
  }
  set domain(domain: {en: string, fr: string}) { this._domain = domain; }

  get domain() {
    return this._domain;
  }

  get project() {
    return this._project;
  }

  get dirty() {
    return this._dirty;
  }

}
