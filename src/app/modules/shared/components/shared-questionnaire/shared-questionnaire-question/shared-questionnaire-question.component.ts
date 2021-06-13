import {Component, HostListener, Input, OnInit} from '@angular/core';
import {picto, Picto} from '../../../../../models/static-data/picto';
import {
  MissionQuestion,
  MissionQuestionEntry,
  MissionQuestionOption,
  MissionQuestionOptionType,
  OptionEntry
} from '../../../../../models/mission';
import {MissionQuestionService} from '../../../../../services/mission/mission-question.service';
import {CommonService} from '../../../../../services/common/common.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-shared-questionnaire-question',
  templateUrl: './shared-questionnaire-question.component.html',
  styleUrls: ['./shared-questionnaire-question.component.scss']
})
export class SharedQuestionnaireQuestionComponent implements OnInit {

  get picto(): Picto {
    return this._picto;
  }

  get platformLang() {
    return this._translateService.currentLang;
  }

  get questionnaireLangs(): Array<string> {
    return this._missionQuestionService.questionnaireLangs || [];
  }

  get customId(): string {
    return this._customId;
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

  /**
   * can be edit or not.
   */
  @Input() isEditable = false;

  /**
   * question belong to which array
   * we need it to identify to which array will move up or down the question.
   */
  @Input() questionBelong: 'ESSENTIALS' | 'COMPLEMENTARY' = 'COMPLEMENTARY';

  /**
   * provide the innovation cards lang.
   */
  @Input() presetLanguages: Array<string> = [];

  @Input() set question(value: MissionQuestion) {
    this._question = value;

    if (this._question.identifier && this.isTaggedQuestion) {
      this._customId = this._missionQuestionService.generateId();
    } else {
      this._customId = this._question.identifier;
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

  private _question: MissionQuestion = <MissionQuestion>{};

  private _questionIndex = 0;

  private _sectionIndex = 0;

  private _editMode = false;

  isTaggedQuestion = false;

  private _customId = '';

  private _picto: Picto = picto;

  constructor(private _missionQuestionService: MissionQuestionService,
              private _translateService: TranslateService) { }

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
    this._missionQuestionService.moveQuestionOption(this._questionIndex, this._sectionIndex, optionIndex, move);
  }

  public removeQuestion(event: Event) {
    event.preventDefault();

    const _msg = this.platformLang === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette question ?'
      : 'Are you sure you want to delete this question?';
    const res = confirm(_msg);

    if (res) {
      this._missionQuestionService.removeQuestion(this._questionIndex, this._sectionIndex);
    }
  }

  public cloneQuestion(event: Event) {
    event.preventDefault();
    this._missionQuestionService.cloneQuestion(this._questionIndex, this._sectionIndex);
  }

  public onChangeQuestionType(type: MissionQuestionOptionType) {
    this._question.controlType = type;
    this._missionQuestionService.configureQuestion(this._question);
  }

  public addNewOption(event: Event) {
    event.preventDefault();
    this._missionQuestionService.addNewOption(this._question);
  }

  public onChangeMaxOptions(value: number) {
    if (value !== null) {
      this._question = this._missionQuestionService.configureCheckbox(this._question, value);
      this.notifyChanges();
    }
  }

  public onChangeQuestionEntry(value: string, lang: string, attr: string) {
    this._missionQuestionService.changeQuestionEntry(value, lang, this._question, attr);
  }

  public onChangeQuestionOptionEntry(value: string, lang: string, optionIndex: number) {
    this._missionQuestionService.changeQuestionOptionEntry(value, lang, this._question, optionIndex);
  }

  public deleteOption(event: Event, index: number) {
    event.preventDefault();
    this._missionQuestionService.deleteOption(this._question, index);
  }

  public optionEntry(option: MissionQuestionOption, lang: string): OptionEntry {
    return <OptionEntry>MissionQuestionService.entryInfo(option, lang) || <OptionEntry>{};
  }

  public questionEntry(lang: string = this.platformLang): MissionQuestionEntry {
    return this._missionQuestionService.questionEntry(this._question, lang);
  }

  public updateValue(value: any, attr: string, index?: number) {
    if (this.isEditable) {
      switch (attr) {
        case 'COMMENT':
          this._question.canComment = !this._question.canComment;
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
  }

  public notifyChanges() {
    if (this.isEditable) {
      this._missionQuestionService.setNotifyChanges(true);
    }
  }

}
