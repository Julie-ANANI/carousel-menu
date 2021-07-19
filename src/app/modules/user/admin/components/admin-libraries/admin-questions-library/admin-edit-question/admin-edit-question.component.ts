import {Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {
  MissionQuestion,
  MissionQuestionEntry,
  MissionQuestionOption,
  MissionQuestionType,
  OptionEntry
} from '../../../../../../../models/mission';
import {MissionQuestionService} from '../../../../../../../services/mission/mission-question.service';
import {ActivatedRoute} from '@angular/router';
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

interface ConfirmUpdate {
  tool: boolean;
  template: boolean;
}

@Component({
  selector: 'app-admin-edit-question',
  templateUrl: './admin-edit-question.component.html',
  styleUrls: ['./admin-edit-question.component.scss']
})
export class AdminEditQuestionComponent implements OnInit {

  get isTaggedQuestion(): boolean {
    return this._missionQuestionService.isTaggedQuestion(this.question.identifier);
  }

  get platformLang(): string {
    return this._translateService.currentLang;
  }

  fetchingError = false;

  isSaving = false;

  questionnaireLangs: Array<string> = ['en', 'fr'];

  accessPath: Array<string> = ['libraries', 'questions'];

  validate: ConfirmUpdate = <ConfirmUpdate>{};

  showModal = false;

  question: MissionQuestion = <MissionQuestion>{};

  name = '';

  toBeSaved = false;

  picto: Picto = picto;

  editMode = true;

  customId = '';

  nonUsedQuestions: Array<string> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _missionService: MissionService,
              private _translateService: TranslateService,
              private _translateTitleService: TranslateTitleService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _missionQuestionService: MissionQuestionService) { }

  ngOnInit() {
    this.question = this._missionQuestionService.question;
    this._initVariables();

    /**
     * if the user refresh the page in that case we do not have the value in the
     * this._missionQuestionService.question so in that case we call the back service.
     */
    this._activatedRoute.params.subscribe((params) => {
      const id = params['questionId'] || '';
      if (!!id && (id !== this.question._id) || !this.question._id ) {
        this._getQuestion(id);
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

  private _getQuestion(id: string) {
    if (isPlatformBrowser(this._platformId)) {
      this._missionService.getQuestion(id).pipe(first()).subscribe((response) => {
        this.question = response;
        this._initVariables();
      }, error => {
        this.fetchingError = true;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
        console.error(error);
      });
    }
  }


  private _initVariables() {
    this._questionName();
    this._setTitle();
    this._initCustomId();
    this._initNonUsedQuestions();
  }

  public questionEntry(lang: string = this.platformLang): MissionQuestionEntry {
    return this._missionQuestionService.questionEntry(this.question, lang);
  }

  public optionEntry(option: MissionQuestionOption, lang: string): OptionEntry {
    return <OptionEntry>MissionQuestionService.entryInfo(option, lang) || <OptionEntry>{};
  }

  private _questionName() {
    this.name = MissionQuestionService.label(this.question, 'label', this.platformLang);
  }

  private _setTitle() {
    this._translateTitleService.setTitle(`${this.name} | Questions | Libraries`);
  }

  private _initCustomId() {
    if (this.question.identifier && this.isTaggedQuestion) {
      this.customId = this._missionQuestionService.generateId();
    } else {
      this.customId = this.question.identifier;
    }
  }

  private _initNonUsedQuestions() {
    this.nonUsedQuestions = Object.keys(this._missionQuestionService.taggedQuestionsTypes).filter((_type) => {
      return _type !== this.question.identifier;
    }).sort();
  }

  /**
   * to check the user has access to the defined functionality on the page or not.
   *
   * @param path
   */
  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath);
    }
  }

  public onClickSave(event: Event) {
    event.preventDefault();
    if (this.canAccess(['edit']) && this.toBeSaved && !this.isSaving) {
      this.showModal = true;
      this.validate = <ConfirmUpdate>{};
    }
  }

  public closeModal() {
    this.showModal = false;
    this.validate = <ConfirmUpdate>{};
  }

  /**
   * will update the question in the back.
   *
   * @param event
   */
  public onClickValidate(event: Event) {
    event.preventDefault();
    if (this.validate.tool && this.validate.template) {
      this.isSaving = true;
      this._updateQuestion();
    }
  }

  private _updateQuestion() {
    this._missionService.updateQuestion(this.question._id, this.question).pipe(first()).subscribe((_) => {
      this.closeModal();
      this.isSaving = false;
      this.toBeSaved = false;
      this._translateNotificationsService.success('Success', 'The question has been updated successfully.');
    }, error => {
      this.isSaving = false;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
      console.error(error);
    });
  }

  public remove(event: Event) {
    event.preventDefault();
  }

  public onChangeQuestionType(type: MissionQuestionType) {

  }

  public onChangeIdentifier(identifier: string) {

  }

  public updateValue(value: any, attr: string, index?: number) {

  }

  public onChangeMaxOptions(value: number) {

  }

  public onChangeQuestionEntry(value: string, lang: string, attr: string) {

  }

  public moveQuestionOption(event: Event, optionIndex: number, move: 1 | -1) {

  }

  public onChangeQuestionOptionEntry(value: string, lang: string, optionIndex: number) {

  }

  public deleteOption(event: Event, index: number) {

  }

}
