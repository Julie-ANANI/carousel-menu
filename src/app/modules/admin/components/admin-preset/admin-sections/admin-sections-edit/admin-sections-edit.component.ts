import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { Question } from '../../../../../../models/question';
import { Section } from '../../../../../../models/section';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './admin-sections-edit.component.html',
  styleUrls: ['./admin-sections-edit.component.scss']
})
export class AdminSectionsEditComponent implements OnInit {

  private _section: Section;
  public formData: FormGroup;
  private _addQuestionConfig: {
    placeholder: string,
    initialData: Array<Question>,
    type: string,
    identifier: string,
    canOrder: boolean
  } = {
    placeholder: 'PRESETS.SECTION.EDIT.QUESTION_PLACEHOLDER',
    initialData: [],
    type: 'questions',
    identifier: 'identifier',
    canOrder: true
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
    this._activatedRoute.params.subscribe(params => {
      const sectionId = params['sectionId'];
      this._presetService.getSection(sectionId)
        .first()
        .subscribe(section => {
          this._section = section;
          this._addQuestionConfig.initialData = section.questions;
          this.formData = this._formBuilder.group({
            label: this._formBuilder.group({
              fr: [section.label ? section.label.fr || '' : '', Validators.required],
              en: [section.label ? section.label.en || '' : '', Validators.required]
            }),
            description: [section.description ? section.description : 'nothing', Validators.required],
            questions: []
          });
        });
    });
  }

  /**
   * Sauvegarde
   * @param callback
   */
  public save() {
    const saveSubs = this._presetService
      .saveSection(this._section._id, this.formData.value)
      .first()
      .subscribe(data => {
        this._section = data;
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.SECTION.UPDATED');
      }, err => {
        this._notificationsService.error('ERROR.SECTION.UNFORBIDDEN', err);
      });
  }

  public addQuestion(event: any): void {
    this.formData.get('questions').setValue(event.value);
  }

  get addQuestionConfig() { return this._addQuestionConfig; }
  get domSanitizer() { return this._domSanitizer; }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get section(): Section { return this._section; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

}
