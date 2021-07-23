import {Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {
  MissionQuestion,
  MissionQuestionEntry,
  MissionQuestionOption,
  MissionQuestionType,
  OptionEntry
} from '../../../../../../../models/mission';
import {MissionQuestionService} from '../../../../../../../services/mission/mission-question.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {MissionService} from '../../../../../../../services/mission/mission.service';
import {first} from 'rxjs/operators';
import {ErrorFrontService} from '../../../../../../../services/error/error-front.service';
import {TranslateNotificationsService} from '../../../../../../../services/notifications/notifications.service';
import {RolesFrontService} from '../../../../../../../services/roles/roles-front.service';
import {picto, Picto} from '../../../../../../../models/static-data/picto';
import {TranslateService} from '@ngx-translate/core';
import {TranslateTitleService} from '../../../../../../../services/title/title.service';
import {CommonService} from '../../../../../../../services/common/common.service';
import {HttpErrorResponse} from '@angular/common/http';

interface ConfirmUpdate {
  tool: boolean;
  template: boolean;
}

@Component({
  templateUrl: './admin-edit-question.component.html',
  styleUrls: ['./admin-edit-question.component.scss']
})
export class AdminEditQuestionComponent implements OnInit {

  get isRemoving(): boolean {
    return this._isRemoving;
  }

  get canBeDeleted(): boolean {
    return this._canBeDeleted;
  }

  get isPartUseCase(): boolean {
    return this._isPartUseCase;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  get questionnaireLangs(): Array<string> {
    return this._questionnaireLangs;
  }

  get accessPath(): Array<string> {
    return this._accessPath;
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

  get question(): MissionQuestion {
    return this._question;
  }

  get name(): string {
    return this._name;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  get picto(): Picto {
    return this._picto;
  }

  get editMode(): boolean {
    return this._editMode;
  }

  set editMode(value: boolean) {
    this._editMode = value;
  }

  /*get customId(): string {
    return this._customId;
  }*/

  /*get nonUsedQuestions(): Array<string> {
    return this._nonUsedQuestions;
  }*/

  get isTaggedQuestion(): boolean {
    return this._isTaggedQuestion;
  }

  get platformLang(): string {
    return this._translateService.currentLang;
  }

  private _fetchingError = false;

  private _isSaving = false;

  private _questionnaireLangs: Array<string> = ['en', 'fr'];

  private _accessPath: Array<string> = ['libraries', 'questions'];

  private _validate: ConfirmUpdate = <ConfirmUpdate>{};

  private _showModal = false;

  private _question: MissionQuestion = <MissionQuestion>{};

  private _name = '';

  private _toBeSaved = false;

  private _picto: Picto = picto;

  private _editMode = true;

  // private _customId = '';

  // private _nonUsedQuestions: Array<string> = [];

  private _isTaggedQuestion = false;

  private _isPartUseCase = false;

  private _isRemoving = false;

  private _canBeDeleted = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _missionService: MissionService,
              private _translateService: TranslateService,
              private _translateTitleService: TranslateTitleService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _missionQuestionService: MissionQuestionService) { }

  ngOnInit() {
    this._question = this._missionQuestionService.question;
    this._getTemplate(this._question._id);
    this._initVariables();

    /**
     * if the user refresh the page in that case we do not have the value in the
     * this._missionQuestionService.question so in that case we call the back service.
     */
    this._activatedRoute.params.subscribe((params) => {
      const id = params['questionId'] || '';
      if (!!id && (id !== this._question._id) || !this._question._id ) {
        this._getQuestion(id);
        this._getTemplate(id);
      }
    });
  }

  /**
   * auto expand the height of the textarea based on the content length.
   *
   * @param _event
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(_event: KeyboardEvent) {
    const textarea = (_event.target as HTMLTextAreaElement);
    if (!textarea || (textarea.nodeName !== 'TEXTAREA') || (textarea.classList && !textarea.classList.contains('auto-expand'))) {
      return;
    }
    CommonService.calcTextareaHeight(textarea, _event);
  }

  /**
   * we are checking if the question belongs to any use case.
   * If we get error then we make the isPartUseCase = true, just in case.
   *
   * @param id
   * @private
   */
  private _getTemplate(id: string) {
    if (isPlatformBrowser(this._platformId) && !!id) {
      const config = {
        fields: '',
        limit: '1',
        offset: '0',
        search: '{}',
        'sections.questions.question': id,
        sort: '{"created":-1}'
      };
      this._missionService.getAllTemplates(config).pipe(first()).subscribe((response) => {
        this._isPartUseCase = response && response.result && response.result.length > 0;
        this._canBeDeleted = response && response.result && response.result.length === 0;
      }, (error: HttpErrorResponse) => {
        this._isPartUseCase = true;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
        console.error(error);
      });
    }
  }

  private _getQuestion(id: string) {
    if (isPlatformBrowser(this._platformId)) {
      this._missionService.getQuestion(id).pipe(first()).subscribe((response) => {
        this._question = response;
        this._initVariables();
      }, (error: HttpErrorResponse) => {
        this._fetchingError = true;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
        console.error(error);
      });
    }
  }


  private _initVariables() {
    this._isTaggedQuestion = this._missionQuestionService.isTaggedQuestion(this._question.identifier);
    this._questionName();
    this._setTitle();
    // this._initCustomId();
    // this._initNonUsedQuestions();
    this._initSensitive();
  }

  private _initSensitive() {
    if (!this._question.sensitiveAnswerData) {
      if (this._missionQuestionService.isContactQuestion(this._question.identifier)) {
        this._question.sensitiveAnswerData = true;
      }
    }
  }

  public questionEntry(lang: string = this.platformLang): MissionQuestionEntry {
    return this._missionQuestionService.questionEntry(this._question, lang);
  }

  public optionEntry(option: MissionQuestionOption, lang: string): OptionEntry {
    return <OptionEntry>MissionQuestionService.entryInfo(option, lang) || <OptionEntry>{};
  }

  private _questionName() {
    this._name = MissionQuestionService.label(this._question, 'label', this.platformLang);
  }

  private _setTitle() {
    this._translateTitleService.setTitle(`${this._name} | Questions | Libraries`);
  }

  /**
   * discussion going on how to use this functionality and explain to the operators
   * Commented on 22nd july, 2021
   */
  /*private _initCustomId() {
    if (this._question.identifier && this._isTaggedQuestion) {
      this._customId = this._missionQuestionService.generateId();
    } else {
      this._customId = this._question.identifier;
    }
  }*/

  /*private _initNonUsedQuestions() {
    this._nonUsedQuestions = Object.keys(this._missionQuestionService.taggedQuestionsTypes).filter((_type) => {
      return _type !== this._question.identifier;
    }).sort();
  }*/

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

  /**
   * delete the question.
   *
   * @param event
   */
  public onRemove(event: Event) {
    event.preventDefault();
    if (!this._isRemoving && this.canAccess(['delete'])) {
      this._isRemoving = true;
      this._missionService.removeQuestion(this._question._id).pipe(first()).subscribe((_) => {
        this._translateNotificationsService.success('Success', 'The question has been deleted successfully.');
        this._router.navigate(['/user/admin/libraries/questions']);
      }, (error: HttpErrorResponse) => {
        this._isRemoving = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
        console.error(error);
      });
    }
  }

  /**
   * if the question is not part of the use case them we don't show the modal.
   * We just simply Save it.
   *
   * @param event
   */
  public onClickSave(event: Event) {
    event.preventDefault();
    if (this.canAccess(['edit']) && this._toBeSaved && !this._isSaving) {
      if (!this._isPartUseCase) {
        this._isSaving = true;
        this._updateQuestion();
      } else {
        this._showModal = true;
        this._validate = <ConfirmUpdate>{};
      }
    }
  }

  public closeModal() {
    this._showModal = false;
    this._validate = <ConfirmUpdate>{};
  }

  /**
   * will update the question in the back.
   *
   * @param event
   */
  public onClickValidate(event: Event) {
    event.preventDefault();
    if (this._validate.tool && this._validate.template) {
      this._isSaving = true;
      this._updateQuestion();
    }
  }

  private _updateQuestion() {
    this._missionService.updateQuestion(this._question._id, this._question).pipe(first()).subscribe((_) => {
      this.closeModal();
      this._isSaving = false;
      this._toBeSaved = false;
      this._translateNotificationsService.success('Success', 'The question has been updated successfully.');
    }, (error: HttpErrorResponse) => {
      this._isSaving = false;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
      console.error(error);
    });
  }

  /*public remove(event: Event) {
    event.preventDefault();
  }*/

  private _notifyChanges() {
    if (this.canAccess(['edit']) && this._editMode) {
      this._toBeSaved = true;
    }
  }

  public onChangeQuestionType(type: MissionQuestionType) {
    this._question.controlType = type;
    this._question = this._missionQuestionService.configureQuestion(this._question, false);
    this._notifyChanges();
  }

  public onChangeIdentifier(identifier: string) {
    this._isTaggedQuestion = this._missionQuestionService.isTaggedQuestion(identifier);
    if (this._isTaggedQuestion) {
      this._question.controlType = this._missionQuestionService.getQuestionType(identifier);
    }
    this._notifyChanges();
  }

  public updateValue(value: any, attr: string, index?: number) {

    switch (attr) {
      case 'COMMENT':
        this._question.canComment = !this._question.canComment;
        break;
      case 'RANDOMIZATION':
        this._question.randomization = !this._question.randomization;
        break;
      case 'SENSITIVE_DATA':
        this._question.sensitiveAnswerData = !this._question.sensitiveAnswerData;
        break;
      case 'FAV_ANSWERS':
        this._question.visibility = !this._question.visibility;
        break;
      case 'OPTION_POSITIVE':
        this._question.options[index].positive = !this._question.options[index].positive;
        break;
    }

    this._notifyChanges();
  }

  public onChangeMaxOptions(value: number) {
    if (value !== null) {
      this._question = this._missionQuestionService.configureCheckbox(this._question, value);
      this._notifyChanges();
    }
  }

  public onChangeQuestionEntry(value: string, lang: string, attr: string) {
    this._question = this._missionQuestionService.changeQuestionEntry(value, lang, this._question, attr, false);
    this._notifyChanges();
  }

  public moveQuestionOption(event: Event, optionIndex: number, move: 1 | -1) {
    event.preventDefault();
    this._question = this._missionQuestionService.moveQuestionOption(this._question, optionIndex, move, false);
    this._notifyChanges();
  }

  public onChangeQuestionOptionEntry(value: string, lang: string, optionIndex: number) {
    this._question = this._missionQuestionService.changeQuestionOptionEntry(value, lang, this._question, optionIndex, false);
    this._notifyChanges();
  }

  public deleteOption(event: Event, index: number) {
    event.preventDefault();
    this._question = this._missionQuestionService.deleteOption(this._question, index, false);
    this._notifyChanges();
  }

  public addNewOption(event: Event) {
    event.preventDefault();
    this._question = this._missionQuestionService.addNewOption(this._question, false);
    this._notifyChanges();
  }

}
