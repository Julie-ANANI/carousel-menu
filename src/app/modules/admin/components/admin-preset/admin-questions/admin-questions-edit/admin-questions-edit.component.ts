import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { Question } from '../../../../../../models/question';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './admin-questions-edit.component.html',
  styleUrls: ['./admin-questions-edit.component.scss']
})
export class AdminQuestionsEditComponent implements OnInit {

  private _question: Question;
  public formData: FormGroup;
  private _options: FormArray;

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
      this._presetService.getQuestion(questionId).first().subscribe(question => {
        this._question = question;
        this.formData = this._formBuilder.group({
          controlType: [this._question.controlType, Validators.required],
          title: this._formBuilder.group({
            fr: [question.title ? question.title.fr || '' : '', Validators.required],
            en: [question.title ? question.title.en || '' : '', Validators.required]
          }),
          subtitle: this._formBuilder.group({
            fr: [question.subtitle ? question.subtitle.fr || '' : '', Validators.required],
            en: [question.subtitle ? question.subtitle.en || '' : '', Validators.required]
          }),
          label: this._formBuilder.group({
            fr: [question.label ? question.label.fr || '' : '', Validators.required],
            en: [question.label ? question.label.en || '' : '', Validators.required]
          }),
          options: this._formBuilder.array([]),
          parameters: this._formBuilder.group({
            type: [question.parameters ? question.parameters.type || '' : '', Validators.required],
            addon: [question.parameters ? question.parameters.addon || '' : '', Validators.required],
            min: [question.parameters ? question.parameters.min || '' : '', Validators.required],
            max: [question.parameters ? question.parameters.max || '' : '', Validators.required],
          }),
          canComment: [question.canComment && question.controlType != 'textArea' && question.controlType != 'toggle']
        });
        this.buildOptions(question.options);
      });
    });
  }

  /**
   * Sauvegarde
   * @param callback
   */
  public save() {
    const saveSubs = this._presetService
      .saveQuestion(this._question._id, this.formData.value)
      .first()
      .subscribe(data => {
        this._question = data;
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.QUESTION.UPDATED');
      }, err => {
        this._notificationsService.error('ERROR.QUESTION.UNFORBIDDEN', err);
      });
  }

  buildOptions(options: Array<any>) {
    const optionsFormArray = this._formBuilder.array(options.length ?
      options.map(option => this.buildOption(option)) :
      [this.buildOption()]);
    this.formData.setControl('options', optionsFormArray);
  }

  buildOption(option?: any) {
    return this._formBuilder.group({
      identifier: [option && option.identifier || '', Validators.required],
      label: this._formBuilder.group({
        fr: [option && option.label ? option.label.fr || '' : '', Validators.required],
        en: [option && option.label ? option.label.en || '' : '', Validators.required]
      }),
      positive: [option ? option.positive : false],
      color: [option ? option.color: '', Validators.required]
    })
  }

  addOption() {
    this.options.push(this.buildOption());
  }

  removeOption(index: number) {
    const tmp = this.options.controls.splice(index, 1);
    this.options.patchValue(tmp);
  }

  set options(value: FormArray) { this._options = value; }
  get options(): FormArray { return this.formData.get('options') as FormArray; };
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get question() { return this._question; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

}
