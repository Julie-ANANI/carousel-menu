import {Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PresetFrontService} from '../../../../../services/preset/preset-front.service';
import {Question} from '../../../../../models/question';
import {picto, Picto} from '../../../../../models/static-data/picto';
import {InnovationFrontService} from '../../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-shared-preset-question',
  templateUrl: './shared-preset-question.component.html',
  styleUrls: ['./shared-preset-question.component.scss']
})
export class SharedPresetQuestionComponent {

  /***
   * the preset is editable or not.
   */
  @Input() isEditable = false;

  /**
   * provide the innovation cards lang.
   */
  @Input() presetLanguages: Array<string> = [];

  @Input() set question(value: Question) {
    this._question = value;
    this._isTaggedQuestion = this._presetFrontService.isTaggedQuestion(value.identifier);
    this._isContactQuestion = this._presetFrontService.isContactQuestion(value.identifier);
    if (this._question.identifier && this._isTaggedQuestion) {
      this._customId = this._presetFrontService.generateId();
    } else {
      this._customId = this._question.identifier;
    }

    if (this._isContactQuestion) {
      this.question.sensitiveAnswerData = true;
    }
  }

  @Input() set questionIndex(value: number) {
    this._questionIndex = value;
  }

  @Input() set sectionIndex(value: number) {
    this._sectionIndex = value;
  }

  private _question: Question = <Question>{};

  private _questionIndex: number;

  private _sectionIndex: number;

  private _customId = '';

  private _isTaggedQuestion = false;

  private _isContactQuestion = false;

  public editMode = false;

  private _picto: Picto = picto;

  constructor(private _presetFrontService: PresetFrontService,
              private _innovationFrontService: InnovationFrontService,
              private _translateService: TranslateService) {
  }

  public removeQuestion(event: Event) {
    event.preventDefault();

    const _msg = this.platformLang === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette question ?'
      : 'Are you sure you want to delete this question?';
    const res = confirm(_msg);

    if (res) {
      this._presetFrontService.removeQuestion(this._questionIndex, this._sectionIndex);
      this.notifyChanges();
    }
  }

  public cloneQuestion(event: Event) {
    event.preventDefault();
    this._presetFrontService.cloneQuestion(this._questionIndex, this._sectionIndex);
    this.notifyChanges();
  }

  public addNewOption(event: Event) {
    event.preventDefault();
    const options = this._question.options;
    const stringId = options.length.toString();
    const newOption = {
      identifier: stringId,
      label: {
        en: 'Option ' + stringId,
        fr: 'Option ' + stringId
      }
    };
    options.push(newOption);
    this.notifyChanges();
  }

  public deleteOption(event: Event, index: number) {
    event.preventDefault();
    const options = this._question.options;
    options.splice(index, 1);
    PresetFrontService.reConfigureOptionsIdentifier(options);
    this.notifyChanges();
  }

  public upQuestion(event: Event) {
    event.preventDefault();
    this._presetFrontService.moveQuestion(this._questionIndex, this._sectionIndex, -1);
    this.notifyChanges();
  }

  public downQuestion(event: Event) {
    event.preventDefault();
    this._presetFrontService.moveQuestion(this._questionIndex, this._sectionIndex, 1);
    this.notifyChanges();
  }

  public moveQuestionOption(event: Event, optionIndex: number, move: 1 | -1) {
    event.preventDefault();
    this._presetFrontService.moveQuestionOption(this._questionIndex, this._sectionIndex, optionIndex, move);
    this.notifyChanges();
  }

  public onChangeInstruction(value: string, lang: string) {
    if (!this._question.instruction) {
      this._question.instruction = {
        en: '',
        fr: ''
      };
    }
    this._question.instruction[lang] = value;
    this.notifyChanges();
  }

  public getNonUsedQuestions() {
    return this._presetFrontService.getNonUsedQuestions();
  }

  public changeIdentifier(identifier: string) {
    this._isTaggedQuestion = this._presetFrontService.isTaggedQuestion(identifier);
    if (this._isTaggedQuestion) {
      this._question.controlType = this._presetFrontService.getQuestionType(identifier);
    }
    this.notifyChanges();
  }

  public setColor(color: string, index: number) {
    this._question.options[index].color = color;
    this.notifyChanges();
  }

  public notifyChanges() {
    if (this.isEditable) {
      this._innovationFrontService.setNotifyChanges({key: 'preset', state: true});
      this._presetFrontService.setNotifyChanges(true);
    }
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

  get questionLabel(): string {
    return this._presetFrontService.questionLabel(this._question, this.presetLanguages);
  }

  get platformLang() {
    return this._translateService.currentLang;
  }

  get question(): Question {
    return this._question;
  }

  get customId(): string {
    return this._customId;
  }

  get isTaggedQuestion(): boolean {
    return this._isTaggedQuestion;
  }

  get questionIndex(): number {
    return this._questionIndex;
  }

  get picto(): Picto {
    return this._picto;
  }

}
