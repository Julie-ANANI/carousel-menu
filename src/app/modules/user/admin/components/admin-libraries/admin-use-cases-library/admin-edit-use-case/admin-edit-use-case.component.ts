import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MissionQuestionService } from '../../../../../../../services/mission/mission-question.service';
import { MissionTemplate } from '../../../../../../../models/mission';
import { MissionService } from '../../../../../../../services/mission/mission.service';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../../../../services/translate-notifications/translate-notifications.service';
import { ErrorFrontService } from '../../../../../../../services/error/error-front.service';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { MissionFrontService } from '../../../../../../../services/mission/mission-front.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTitleService } from '../../../../../../../services/title/title.service';
import { HttpErrorResponse } from '@angular/common/http';
import { lang, Language } from "../../../../../../../models/static-data/language";

interface ConfirmUpdate {
  tool: boolean;
  template: boolean;
}

@Component({
  templateUrl: './admin-edit-use-case.component.html',
  styleUrls: ['./admin-edit-use-case.component.scss']
})
export class AdminEditUseCaseComponent implements OnInit {

  private _fetchingError = false;

  private _missionTemplate = <MissionTemplate>{};

  private _isSaving = false;

  private _toBeSaved = false;

  /**
   * template languages
   * @private
   */
  private _questionnaireLanguages: Array<Language> = lang;

  private _accessPath: Array<string> = ['libraries', 'useCases'];

  private _validate: ConfirmUpdate = <ConfirmUpdate>{};

  private _showModal = false;

  /**
   * store the actions in the order wise they are performed.
   *
   * @private
   */
  private _valuesToSave: Array<any> = [];

  private _toSaveQuestion = false;

  private _templates: Array<MissionTemplate> = [];

  private _templateName = '';

  private _rightMirrorLanguage: Language = null;

  private _leftMirrorLanguage: Language = null;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _missionService: MissionService,
              private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _rolesFrontService: RolesFrontService,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _missionQuestionService: MissionQuestionService) {
  }

  ngOnInit() {
    this._missionTemplate = this._missionQuestionService.template;
    this._templates = this._missionQuestionService.allTemplates;
    this._jsonParse();
    this._setTitle();
    this.setLanguages();

    /**
     * if the user refresh the page in that case we do not have the value in the
     * this._missionQuestionService.template so in that case we call the back service.
     */
    this._activatedRoute.params.subscribe((params) => {
      const id = params['templateId'] || '';
      if (!!id && (id !== this._missionTemplate._id) || !this._missionTemplate._id) {
        this._getTemplate(id);
      }
    });

    if (!this._templates.length) {
      this._getAllTemplates();
    }

    this._missionQuestionService.questionnaireLangs = this._questionnaireLanguages;

  }

  setLanguages() {
    this._leftMirrorLanguage = this._questionnaireLanguages[0];
    this._rightMirrorLanguage = this._questionnaireLanguages[1];
  }

  getObjective(lang: string = 'en') {
    if (this._missionTemplate && this._missionTemplate.entry && this._missionTemplate.entry.length) {
      const entry = this._missionTemplate.entry.find(e => e.lang === lang);
      return entry && entry.objective || '';
    }
  }

  private _jsonParse() {
    this._templates = JSON.parse(JSON.stringify(this._templates));
  }

  private _getAllTemplates() {
    if (isPlatformBrowser(this._platformId)) {
      this._missionService.getAllTemplates().pipe(first()).subscribe((response) => {
        this._templates = response && response.result || [];
        this._jsonParse();
      }, (error: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
        console.error(error);
      });
    }
  }

  private _getTemplate(id: string) {
    if (isPlatformBrowser(this._platformId)) {
      this._missionService.getTemplate(id).pipe(first()).subscribe((response) => {
        this._missionTemplate = response;
        this._templateName = MissionFrontService.objectiveName(this._missionTemplate, this.currentLang);
        this._setTitle();
      }, (error: HttpErrorResponse) => {
        this._fetchingError = true;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
        console.error(error);
      });
    }
  }

  /**
   * to check the user has access to the defined functionality on the page or not.
   *
   * @param path
   */
  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(this._accessPath.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
    }
  }

  public onChangeObjective(event: string, lang: string) {
    if (this.canAccess(['edit', 'objective'])) {
      const entry = this._missionTemplate.entry.find(e => e.lang === lang);
      if (entry) {
        entry.objective = event.trim();
        this._toBeSaved = true;
      }
    }
  }

  public onChangeTemplate(event: MissionTemplate) {
    if (this.canAccess(['section', 'edit'])) {
      this._missionTemplate = event;
      this._toBeSaved = true;
    }
  }

  public closeModal() {
    this._showModal = false;
    this._validate = <ConfirmUpdate>{};
  }

  /**
   * to the back we send the data object that always contains the
   * mission template and questions actions if any changes in the questions.
   *
   * @param event
   */
  public onClickValidate(event: Event) {
    event.preventDefault();
    if (this._validate.tool && this._validate.template) {
      this._isSaving = true;
      const data = {template: this._missionTemplate};

      if (this._toSaveQuestion) {
        data['actions'] = this._valuesToSave;
      }

      this._updateLibraryTemplate(data);
    }
  }

  /**
   * to update the changes in the back.
   *
   * @param data
   * @private
   */
  private _updateLibraryTemplate(data = {}) {
    this._missionService.saveLibraryTemplate(this._missionTemplate._id, data)
      .pipe(first())
      .subscribe((_) => {
        this.closeModal();
        this._valuesToSave = [];
        this._toSaveQuestion = false;
        this._isSaving = false;
        this._toBeSaved = false;
        this._translateNotificationsService.success('Success', 'The use case has been updated successfully.');
      }, (error: HttpErrorResponse) => {
        this._isSaving = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
        console.error(error);
      });
  }

  public objectiveName(template: MissionTemplate) {
    return MissionFrontService.objectiveName(template, this.currentLang);
  }

  private _setTitle() {
    this._translateTitleService.setTitle(`${this._templateName} | Use cases | Libraries`);
  }

  public onClickSave(event: Event) {
    event.preventDefault();
    if ((this.canAccess(['section', 'edit']) || this.canAccess(['question', 'edit'])) && this._toBeSaved && !this._isSaving) {
      this._showModal = true;
      this._validate = <ConfirmUpdate>{};
    }
  }

  /**
   * we are adding the Action to the list based on the key.
   *
   * @param event
   */
  public changeStack(event: { key: string, value: any }) {
    if (!!event && this.canAccess(['question', 'edit'])) {

      switch (event.key) {

        case 'QUESTION_REMOVE_SCRATCH':
          this._removeAction(event);
          break;

        case 'QUESTION_ADD':
          this._valuesToSave.unshift(event);
          break;

        case 'QUESTION_EDIT':
          this._addAction(event);
          break;
      }

      this._toSaveQuestion = true;
      this._toBeSaved = true;

    }
  }

  /**
   * if the remove question has not creted in the back yet we delete it from the
   * actions list.
   *
   * @param event
   * @private
   */
  private _removeAction(event: { key: string, value: any }) {
    const index = this._valuesToSave.findIndex((_value) => {
      return (_value.value.identifier === event.value.identifier && _value.key === 'QUESTION_ADD');
    });
    if (index !== -1) {
      this._valuesToSave.splice(index, 1);
    }
  }

  /**
   * first we try to search in the this._valuesToSave if we have already the same action and same
   * identifier we remove it and push it to the last.
   *
   * @param event: {key: string, value: any}
   * @private
   */
  private _addAction(event: { key: string, value: any }) {
    const index = this._valuesToSave.findIndex((_value) => _value.value.quesId === event.value.quesId);
    if (index !== -1) {
      this._valuesToSave.splice(index, 1);
    }
    this._valuesToSave.push(event);
  }

  public onChangeUseCase(event: string) {
    if (!this._toBeSaved) {
      this._missionTemplate = this._templates.find((_template) => _template._id === event);
    }
  }

  get templateName(): string {
    return this._templateName;
  }

  get templates(): Array<MissionTemplate> {
    return this._templates;
  }

  get validate(): ConfirmUpdate {
    return this._validate;
  }

  set validate(value: ConfirmUpdate) {
    this._validate = value;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  get questionnaireLanguages(): Array<Language> {
    return this._questionnaireLanguages;
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  get missionTemplate(): MissionTemplate {
    return this._missionTemplate;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }


  get rightMirrorLanguage(): Language {
    return this._rightMirrorLanguage;
  }

  set rightMirrorLanguage(value: Language) {
    this._rightMirrorLanguage = value;
  }

  get leftMirrorLanguage(): Language {
    return this._leftMirrorLanguage;
  }

  set leftMirrorLanguage(value: Language) {
    this._leftMirrorLanguage = value;
  }
}
