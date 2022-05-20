import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {
  AttitudeMeasureType,
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
import {TranslateNotificationsService} from '../../../../../../../services/translate-notifications/translate-notifications.service';
import {RolesFrontService} from '../../../../../../../services/roles/roles-front.service';
import {picto, Picto} from '../../../../../../../models/static-data/picto';
import {TranslateService} from '@ngx-translate/core';
import {TranslateTitleService} from '../../../../../../../services/title/title.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UmiusConfigInterface} from '@umius/umi-common-component';
import { lang, Language } from "../../../../../../../models/static-data/language";

interface ConfirmUpdate {
  tool: boolean;
  template: boolean;
}

@Component({
  templateUrl: './admin-edit-question.component.html',
  styleUrls: ['./admin-edit-question.component.scss']
})
export class AdminEditQuestionComponent implements OnInit {

  private _fetchingError = false;

  private _isSaving = false;

  private _questionnaireLangs: Array<Language> = lang;

  private _accessPath: Array<string> = ['libraries', 'questions'];

  private _validate: ConfirmUpdate = <ConfirmUpdate>{};

  private _showModal = false;

  private _question: MissionQuestion = <MissionQuestion>{};

  private _name = '';

  private _toBeSaved = false;

  private _picto: Picto = picto;

  private _editMode = true;

  private _isTaggedQuestion = false;

  private _isPartUseCase = false;

  private _isRemoving = false;

  private _canBeDeleted = false;

  private _questions: Array<MissionQuestion> = [];

  private _questionsConfig: UmiusConfigInterface = {
    fields: '',
    limit: '-1',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _rightMirrorLanguage: Language = null;

  private _leftMirrorLanguage: Language = null;


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
    this._questions = this._missionQuestionService.allQuestions;
    this._jsonParse();
    this._getTemplate(this._question._id);
    this._initVariables();
    this.setLanguages();

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

    if (!this._questions.length) {
      this._getAllQuestions();
    }
  }

  setLanguages() {
    this._leftMirrorLanguage = this._questionnaireLangs[0];
    this._rightMirrorLanguage = this._questionnaireLangs[1];
  }

  private _getAllQuestions() {
    if (isPlatformBrowser(this._platformId)) {
      this._missionService.getAllQuestions(this._questionsConfig).pipe(first()).subscribe((response) => {
        this._questions = response && response.result || [];
        this._jsonParse();
      }, (error: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
        console.error(error);
      });
    }
  }

  private _jsonParse() {
    this._questions = JSON.parse(JSON.stringify(this._questions));
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
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
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
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
        console.error(error);
      });
    }
  }


  private _initVariables() {
    this._isTaggedQuestion = this._missionQuestionService.isTaggedQuestion(this._question.identifier);
    this._setTitle();
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

  public questionLabel(question: MissionQuestion) {
    return MissionQuestionService.label(question, 'label', this.platformLang);
  }

  private _setTitle() {
    this._translateTitleService.setTitle(`${this.questionLabel(this._question)} | Questions | Libraries`);
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
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
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
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
      console.error(error);
    });
  }


  /*public remove(event: Event) {
    event.preventDefault();
  }*/


  public notifyChanges() {
    if (this.canAccess(['edit']) && this._editMode) {
      this._toBeSaved = true;
    }
  }

  public onChangeQuestionType(type: MissionQuestionType) {
    this._question.controlType = type;
    this._question = this._missionQuestionService.configureQuestion(this._question, false);
    this.notifyChanges();
  }

  /** It's function for change ngModel : question.attitudeMeasure
   * @param Type : AttitudeMeasureType
   * @return type attitudeMeasure + fn configureQuestion
   * */
  public onChangeTypeLikertScale(type: AttitudeMeasureType) {
    this._question.attitudeMeasure = type;
    this._question = this._missionQuestionService.configureQuestion(this._question, false);
    this.notifyChanges();
  }

  public onChangeIdentifier(identifier: string) {
    this._isTaggedQuestion = this._missionQuestionService.isTaggedQuestion(identifier);
    if (this._isTaggedQuestion) {
      this._question.controlType = this._missionQuestionService.getQuestionType(identifier);
    }
    this.notifyChanges();
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

    this.notifyChanges();
  }

  public onChangeMaxOptions(value: number) {
    if (value !== null) {
      this._question = this._missionQuestionService.configureCheckbox(this._question, value);
      this.notifyChanges();
    }
  }

  public onChangeQuestionEntry(value: string, lang: string, attr: string) {
    this._question = this._missionQuestionService.changeQuestionEntry(value, lang, this._question, attr, false);
    this.notifyChanges();
  }

  public moveQuestionOption(event: Event, optionIndex: number, move: 1 | -1) {
    event.preventDefault();
    this._question = this._missionQuestionService.moveQuestionOption(this._question, optionIndex, move, false);
    this.notifyChanges();
  }

  public onChangeQuestionOptionEntry(value: string, lang: string, optionIndex: number) {
    this._question = this._missionQuestionService.changeQuestionOptionEntry(value, lang, this._question, optionIndex, false);
    this.notifyChanges();
  }

  public deleteOption(event: Event, index: number) {
    event.preventDefault();
    this._question = this._missionQuestionService.deleteOption(this._question, index, false);
    this.notifyChanges();
  }

  public addNewOption(event: Event) {
    event.preventDefault();
    this._question = this._missionQuestionService.addNewOption(this._question, false);
    this.notifyChanges();
  }

  public onChangeQuestion(event: string) {
    if (!this._toBeSaved) {
      this._question = this._questions.find((_question) => _question._id === event);
    }
  }

  get optionsNamesLikert(): any {
    return this._missionQuestionService.optionsNamesLikert;
  }

  get questions(): Array<MissionQuestion> {
    return this._questions;
  }

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

  get questionnaireLangs(): Array<Language> {
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

  get isTaggedQuestion(): boolean {
    return this._isTaggedQuestion;
  }

  get platformLang(): string {
    return this._translateService.currentLang;
  }


  get rightMirrorLanguage(): Language {
    return this._rightMirrorLanguage;
  }

  get leftMirrorLanguage(): Language {
    return this._leftMirrorLanguage;
  }


  set rightMirrorLanguage(value: Language) {
    this._rightMirrorLanguage = value;
  }

  set leftMirrorLanguage(value: Language) {
    this._leftMirrorLanguage = value;
  }
}
