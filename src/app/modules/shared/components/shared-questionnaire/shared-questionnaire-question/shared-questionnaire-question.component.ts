import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import { picto, Picto } from '../../../../../models/static-data/picto';
import {
  AttitudeMeasureType,
  MissionQuestion,
  MissionQuestionEntry,
  MissionQuestionOption,
  MissionQuestionType,
  OptionEntry
} from '../../../../../models/mission';
import { MissionQuestionService } from '../../../../../services/mission/mission-question.service';
import { TranslateService } from '@ngx-translate/core';
import { RolesFrontService } from '../../../../../services/roles/roles-front.service';
import {CommonService} from '../../../../../services/common/common.service';
import { Language } from "../../../../../models/static-data/language";

@Component({
  selector: 'app-shared-questionnaire-question',
  templateUrl: './shared-questionnaire-question.component.html',
  styleUrls: ['./shared-questionnaire-question.component.scss']
})

export class SharedQuestionnaireQuestionComponent implements OnInit {

  /**
   * true if the Array<Question> is of
   * {
   *   essential: boolean
   *   question: MissionQuestion
   * }
   * we use it only in library page.
   */
  @Input() isEssential = false;

  /**
   * its true if we are integrating this under Library route.
   * because there we are editing the use case template or questions directly from the collections.
   */
  @Input() isLibraryView = false;

  /**
   * provide the access path if you are not providing the isEditable input value to give access
   * to the functionalities.
   * Example: use it on the Libraries page.
   */
  @Input() accessPath: Array<string> = [];

  /**
   * can be edit or not.
   */
  @Input() isEditable = false;

  /**
   * provide the innovation cards lang.
   */
  @Input() presetLanguages: Array<string> = [];

  /**
   * language selected
   */
  @Input() languageSelected = 'en';

  @Input() set question(value: MissionQuestion) {
    this._question = value;
    this._questionType = value.type;
    this._isTaggedQuestion = this._missionQuestionService.isTaggedQuestion(value.identifier);

    if (!this._question.sensitiveAnswerData) {
      if (this._missionQuestionService.isContactQuestion(value.identifier)) {
        this._question.sensitiveAnswerData = true;
      }
    }

    if (!this._question.maxOptionsSelect && this._question.controlType === 'checkbox') {
      this._question.maxOptionsSelect = (this._question.options && this._question.options.length);
    }

  }

  @Input() set questionIndex(value: number) {
    this._questionIndex = value;
  }

  @Input() set sectionIndex(value: number) {
    this._sectionIndex = value;
  }

  /**
   * do not change this as we are using this under the Library page use case.
   */
  @Output() valueToSave: EventEmitter<any> = new EventEmitter<any>();

  private _question: MissionQuestion = <MissionQuestion>{};

  private _questionIndex = 0;

  private _sectionIndex = 0;

  private _editMode = false;

  private _isTaggedQuestion = false;

  private _picto: Picto = picto;

  private _questionType = '';

  constructor(private _missionQuestionService: MissionQuestionService,
              private _rolesFrontService: RolesFrontService,
              private _translateService: TranslateService) {
  }

  ngOnInit() {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(_event: KeyboardEvent) {
    const textarea = (_event.target as HTMLTextAreaElement);
    if (!textarea || (textarea.nodeName !== 'TEXTAREA') || (textarea.classList && !textarea.classList.contains('auto-expand'))) {
      return;
    }
    CommonService.calcTextareaHeight(textarea, _event);
  }

  public up(event: Event) {
    event.preventDefault();
    this._missionQuestionService.moveQuestion(this._questionIndex, this._sectionIndex, -1);
  }

  public down(event: Event) {
    event.preventDefault();
    this._missionQuestionService.moveQuestion(this._questionIndex, this._sectionIndex, 1);
  }

  public moveQuestionOption(event: Event, optionIndex: number, move: 1 | -1) {
    event.preventDefault();
    this._missionQuestionService.moveQuestionOption(this._question, optionIndex, move);
    this._emitValueToSave(['edit', 'options', 'order']);
  }

  public removeQuestion(event: Event) {
    event.preventDefault();

    let _msg = this.platformLang === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette question ?'
      : 'Are you sure you want to delete this question?';

    if (this._question.type === 'ESSENTIAL' && !this.isLibraryView) {
     _msg = 'By deleting this question, the specific result visual won’t be available. Do you really ' +
       'want to delete this question ?'
    }

    const res = confirm(_msg);

    if (res) {
      if (this.isEditable || (this.isLibraryView && this.canAccess(['delete']))) {

        if (!this._question._id) {
          this.valueToSave.emit({
            key: 'QUESTION_REMOVE_SCRATCH',
            value: {identifier: this._question.identifier}
          });
        }

        this._missionQuestionService.removeQuestion(this._questionIndex, this._sectionIndex);
      }
    }
  }

  public onChangeTemplateQuestion(event: boolean) {
    if (this.canAccess(['typeInUseCase'])) {
      this._missionQuestionService.template.sections[this._sectionIndex].questions[this._questionIndex]['essential'] = event;
      this._missionQuestionService.setNotifyChanges(true);
    }
  }


  public cloneQuestion(event: Event) {
    event.preventDefault();
    if (this.isEditable) {
      this._missionQuestionService.cloneQuestion(this._questionIndex, this._sectionIndex);
    } /*else if (this.isLibraryView && this.canAccess(['clone'])) {
      const question: MissionQuestion = this._missionQuestionService.cloneQuestion(this._questionIndex, this._sectionIndex, true);
      const value = { essential: false, question: question };
      this._missionQuestionService.template.sections[this._sectionIndex].questions.push(value);
      this.valueToSave.emit({
        key: 'QUESTION_CLONE',
        value: {
          sectionIndex: this._sectionIndex,
          identifier: question.identifier,
          essential: value.essential,
          question: value.question
        }
      });
    }*/
  }

  private _emitValueToSave(access: Array<string>) {
    if (this.isLibraryView && this.canAccess(access) && !!this._question._id) {
      this.valueToSave.emit({
        key: 'QUESTION_EDIT',
        value: {
          quesId: this._question._id,
          ques: this._question
        }
      });
    }
  }

  public onChangeQuestionType(type: MissionQuestionType) {
    this._question.controlType = type;
    this._missionQuestionService.configureQuestion(this._question);
    this._emitValueToSave(['edit', 'type']);
  }

  /** It's function for change ngModel : question.attitudeMeasure
   * @param Type : AttitudeMeasureType
   * @return type attitudeMeasure + fn configureQuestion
   * */
  public onChangeTypeLikertScale(type: AttitudeMeasureType) {
    this._question.attitudeMeasure = type;
    this._missionQuestionService.configureQuestion(this._question);
    this._emitValueToSave(['edit', 'type']);
  }

  public addNewOption(event: Event) {
    event.preventDefault();
    this._missionQuestionService.addNewOption(this._question);
    this._emitValueToSave(['edit', 'options', 'add']);
  }

  public onChangeMaxOptions(value: number) {
    if (value !== null) {
      this._question = this._missionQuestionService.configureCheckbox(this._question, value);
      this._emitValueToSave(['edit', 'maxOptionsSelect']);
      this.notifyChanges();
    }
  }

  public onChangeQuestionEntry(value: string, lang: string, attr: string) {
    this._missionQuestionService.changeQuestionEntry(value, lang, this._question, attr);
    this._emitValueToSave(['edit', attr]);
  }

  public onChangeQuestionOptionEntry(value: string, lang: string, optionIndex: number) {
    this._missionQuestionService.changeQuestionOptionEntry(value, lang, this._question, optionIndex);
    this._emitValueToSave(['edit', 'options', 'label']);
  }

  public deleteOption(event: Event, index: number) {
    event.preventDefault();
    this._missionQuestionService.deleteOption(this._question, index);
    this._emitValueToSave(['edit', 'options', 'delete']);
  }

  public optionEntry(option: MissionQuestionOption): OptionEntry {
    return <OptionEntry>MissionQuestionService.entryInfo(option, this.languageSelected) || <OptionEntry>{};
  }

  public questionEntry(): MissionQuestionEntry {
    return this._missionQuestionService.questionEntry(this._question, this.languageSelected);
  }

  public updateValue(value: any, attr: string, index?: number) {
    if (this.isEditable || this.isLibraryView) {
      switch (attr) {
        case 'COMMENT':
          this._question.canComment = !this._question.canComment;
          this._emitValueToSave(['edit', 'canComment']);
          break;
        case 'RANDOMIZATION':
          this._question.randomization = !this._question.randomization;
          this._emitValueToSave(['edit', 'randomization']);
          break;
        case 'SENSITIVE_DATA':
          this._question.sensitiveAnswerData = !this._question.sensitiveAnswerData;
          this._emitValueToSave(['edit', 'sensitiveAnswerData']);
          break;
        case 'FAV_ANSWERS':
          this._question.visibility = !this._question.visibility;
          this._emitValueToSave(['edit', 'visibility']);
          break;
        case 'OPTION_POSITIVE':
          this._question.options[index].positive = !this._question.options[index].positive;
          this._emitValueToSave(['edit', 'options', 'positive']);
          break;
      }

      this.notifyChanges();
    }
  }

  public notifyChanges() {
    if (this.isEditable) {
      this._missionQuestionService.setNotifyChanges(true);
    }
  }

  public canAccess(path: Array<string> = []) {
    if (this.accessPath.length) {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath.concat(path));
    }

  }

  get optionsNamesLikert(): any {
    return this._missionQuestionService.optionsNamesLikert;
  }

  get isTaggedQuestion(): boolean {
    return this._isTaggedQuestion;
  }

  get picto(): Picto {
    return this._picto;
  }

  get platformLang() {
    return this._translateService.currentLang;
  }

  get questionnaireLangs(): Array<Language> {
    return this._missionQuestionService.questionnaireLangs || [];
  }

  get question(): MissionQuestion {
    return this._question;
  }

  get editMode(): boolean {
    return this._editMode;
  }

  set editMode(value: boolean) {
    this._editMode = value;
  }

  get sectionIndex(): number {
    return this._sectionIndex;
  }

  get questionIndex(): number {
    return this._questionIndex;
  }

  get questionType(): string {
    return this._questionType;
  }


}
