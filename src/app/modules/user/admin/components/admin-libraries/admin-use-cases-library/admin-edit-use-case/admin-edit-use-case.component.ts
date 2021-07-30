import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {MissionQuestionService} from '../../../../../../../services/mission/mission-question.service';
import {MissionTemplate} from '../../../../../../../models/mission';
import {MissionService} from '../../../../../../../services/mission/mission.service';
import {ActivatedRoute} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {first} from 'rxjs/operators';
import {TranslateNotificationsService} from '../../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../../services/error/error-front.service';
import {RolesFrontService} from '../../../../../../../services/roles/roles-front.service';
import {MissionFrontService} from '../../../../../../../services/mission/mission-front.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslateTitleService} from '../../../../../../../services/title/title.service';

interface ConfirmUpdate {
  tool: boolean;
  template: boolean;
}

@Component({
  templateUrl: './admin-edit-use-case.component.html',
  styleUrls: ['./admin-edit-use-case.component.scss']
})
export class AdminEditUseCaseComponent implements OnInit {

  get templateName(): string {
    return this._templateName;
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

  get questionnaireLanguages(): Array<string> {
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

  private _fetchingError = false;

  private _missionTemplate = <MissionTemplate>{};

  private _isSaving = false;

  private _toBeSaved = false;

  private _questionnaireLanguages: Array<string> = ['en', 'fr'];

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

  private _templateName = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _missionService: MissionService,
              private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _rolesFrontService: RolesFrontService,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _missionQuestionService: MissionQuestionService) { }

  ngOnInit() {
    this._missionTemplate = this._missionQuestionService.template;
    this._useCaseName();

    /**
     * if the user refresh the page in that case we do not have the value in the
     * this._missionQuestionService.template so in that case we call the back service.
     */
    this._activatedRoute.params.subscribe((params) => {
      const id = params['templateId'] || '';
      if (!!id && (id !== this._missionTemplate._id) || !this._missionTemplate._id ) {
        this._getTemplate(id);
      }
    });
  }

  private _getTemplate(id: string) {
    if (isPlatformBrowser(this._platformId)) {
      this._missionService.getTemplate(id).pipe(first()).subscribe((response) => {
        this._missionTemplate = response;
        this._useCaseName();
      }, error => {
        this._fetchingError = true;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
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

  public onChangeObjective(event: string, index: number) {
    if (this.canAccess(['edit', 'objective'])) {
      this._missionTemplate.entry[index].objective = event.trim();
      this._toBeSaved = true;
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
      const data = { template: this._missionTemplate };

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
      }, error => {
        this._isSaving = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
        console.error(error);
      });
  }

  private _useCaseName() {
    this._templateName = MissionFrontService.objectiveName(this._missionTemplate, this.currentLang);
    this._setTitle();
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
  public changeStack(event: {key: string, value: any}) {
    if (!!event && this.canAccess(['question', 'edit'])) {

      switch (event.key) {

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
   * first we try to search in the this._valuesToSave if we have already the same action and same
   * identifier we remove it and push it to the last.
   *
   * @param event: {key: string, value: any}
   * @private
   */
  private _addAction(event: {key: string, value: any}) {
    const index = this._valuesToSave.findIndex((_value) => _value.value.quesId === event.value.quesId);
    if (index !== -1) {
      this._valuesToSave.splice(index, 1);
    }
    this._valuesToSave.push(event);
  }

}
