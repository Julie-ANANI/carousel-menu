import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {PresetService} from '../../../../../../services/preset/preset.service';
import {AuthService} from '../../../../../../services/auth/auth.service';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  templateUrl: './admin-sections-edit.component.html',
  styleUrls: ['./admin-sections-edit.component.scss']
})
export class AdminSectionsEditComponent implements OnInit, OnDestroy {

  private _section: any;
  public formData: FormGroup;
  private _addQuestionConfig = {
    placeholder: 'PRESETS.SECTION.EDIT.QUESTION_PLACEHOLDER',
    initialData: [],
    type: 'questions'
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _presetService: PresetService,
              private _authService: AuthService,
              private _domSanitizer: DomSanitizer,
              private _translateService: TranslateService,
              private _router: Router,
              private _notificationsService: TranslateNotificationsService,
              private _formBuilder: FormBuilder) {}

  ngOnInit() {
    const subs = this._activatedRoute.params.subscribe(params => {
      const sectionId = params['sectionId'];
      const subs = this._presetService.getSection(sectionId).subscribe(section => {
        this._section = section;
        this._addQuestionConfig.initialData = section.questions;
        this.formData = this._formBuilder.group({
          label: this._formBuilder.group({
            fr: [section.label ? section.label.fr || '' : '', Validators.required],
            en: [section.label ? section.label.en || '' : '', Validators.required]
          }),
          description: this._formBuilder.group({
            fr: [section.description ? section.description.fr || '' : ''],
            en: [section.description ? section.description.en || '' : '']
          }),
          questions: []
        });
      });
    });
  }

  ngOnDestroy() {
  }

  /**
   * Sauvegarde
   * @param callback
   */
  public save() {
    const saveSubs = this._presetService
      .saveSection(this._section.id, this.formData.value)
      .subscribe(data => {
        this._section = data;
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.SECTION.UPDATED');
      }, err => {
        this._notificationsService.error('ERROR.SECTION.UNFORBIDDEN', err);
      });
  }

  public addQuestion(event): void {
    this.formData.get('questions').setValue(event.value);
  }

  get addQuestionConfig() { return this._addQuestionConfig; }
  get domSanitizer() { return this._domSanitizer; }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get section(): any { return this._section; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

}
