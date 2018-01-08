import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';
import {PresetService} from '../../../../../services/preset/preset.service';
import {AuthService} from '../../../../../services/auth/auth.service';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-admin-question-edit',
  templateUrl: './admin-question-edit.component.html',
  styleUrls: ['./admin-question-edit.component.scss']
})
export class AdminQuestionEditComponent implements OnInit, OnDestroy {

  private _question: any;
  public formData: FormGroup;

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
      const questionId = params['questionId'];
      const subs = this._presetService.getQuestion(questionId).subscribe(question => {
        this._question = question;
        this.formData = this._formBuilder.group({
          title: this._formBuilder.group({
            fr: [question.title ? question.title.fr || '' : '', Validators.required],
            en: [question.title ? question.title.en || '' : '', Validators.required]
          }),
          subTitle: this._formBuilder.group({
            fr: [question.subTitle ? question.subTitle.fr || '' : '', Validators.required],
            en: [question.subTitle ? question.subTitle.en || '' : '', Validators.required]
          }),
          label: this._formBuilder.group({
            fr: [question.label ? question.label.fr || '' : '', Validators.required],
            en: [question.label ? question.label.en || '' : '', Validators.required]
          }),
          choices: (question.controlType === 'radio' || question.controlType === 'checkbox') ? [] : null,
          canComment: question.canComment || (question.controlType != 'textArea' && question.controlType != 'toggle')
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
      .saveQuestion(this._question.id, this.formData.value)
      .subscribe(data => {
        this._question = data;
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.QUESTION.UPDATED');
      }, err => {
        this._notificationsService.error('ERROR.QUESTION.UNFORBIDDEN', err);
      });
  }

  get domSanitizer() { return this._domSanitizer; }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get question(): any { return this._question; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

}
