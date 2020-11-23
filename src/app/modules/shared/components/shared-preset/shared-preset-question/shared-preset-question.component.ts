import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PresetFrontService } from '../../../../../services/preset/preset-front.service';
import { Innovation } from '../../../../../models/innovation';
import { Question } from '../../../../../models/question';
import {picto, Picto} from '../../../../../models/static-data/picto';

@Component({
  selector: 'app-shared-preset-question',
  templateUrl: './shared-preset-question.component.html',
  styleUrls: ['./shared-preset-question.component.scss']
})
export class SharedPresetQuestionComponent {

  @Input() set question(value: Question) {
    this._question = value;
    this._isTaggedQuestion = this.presetService.isTaggedQuestion(value.identifier);
    if (this._question.identifier && this._isTaggedQuestion) {
      this._customId = this.presetService.generateId();
    } else {
      this._customId = this._question.identifier;
    }
  }

  @Input() set questionIndex(value: number) {
    this._questionIndex = value;
  }

  @Input() set sectionIndex(value: number) {
    this._sectionIndex = value;
  }

  private _question: Question;
  private _questionIndex: number;
  private _sectionIndex: number;

  private _customId: string;
  private _isTaggedQuestion: boolean;
  public editMode = false;

  private _language: 'en' | 'fr' = 'en';

  private _picto: Picto = picto;

  private _optionColors: Array<string> = ['#34AC01', '#82CD30', '#F2C500', '#C0210F'];

  constructor(private presetService: PresetFrontService,
              private activatedRoute: ActivatedRoute,
              private translateService: TranslateService) { }

  public removeQuestion(event: Event) {
    event.preventDefault();
    const res = confirm('Are you sure you want to delete this question ?');
    if (res) {
      this.presetService.removeQuestion(this._questionIndex, this._sectionIndex);
      this.notifyChanges();
    }
  }

  public cloneQuestion(event: Event) {
    event.preventDefault();
    this.presetService.cloneQuestion(this._questionIndex, this._sectionIndex);
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

  public fillWithBenefits(event: Event) {
    event.preventDefault();
    const innovation = this.activatedRoute.snapshot.parent.data['innovation'] as Innovation;
    // Calcul benefits
    this._question.options = innovation.innovationCards.reduce((acc, innovCard) => {
      innovCard.advantages.forEach((advantage, index) => {
        if (index < acc.length) {
          acc[index].label[innovCard.lang] = advantage.text;
        } else {
          acc.push({identifier: index.toString(), label: { [innovCard.lang]: advantage.text }});
        }
      });
      return acc;
    }, []);
    this.notifyChanges();
  }

  public deleteOption(event: Event, index: number) {
    event.preventDefault();
    const options = this._question.options;
    options.splice(index, 1);
    // re-index options to keep a count from 0 to X
    options.forEach(function (option, i) {
      option.identifier = i.toString();
    });
    this.notifyChanges();
  }

  public countErrors(lang: string) {
    let missing = 0;
    if (!this._question.label[lang]) { missing ++; }
    if (!this._question.title[lang]) { missing ++; }
    if (!this._question.subtitle[lang]) { missing ++; }
    return missing;
  }

  public up(event: Event) {
    event.preventDefault();
    this.presetService.moveQuestion(this._questionIndex, this._sectionIndex, -1);
    this.notifyChanges();
  }

  public down(event: Event) {
    event.preventDefault();
    this.presetService.moveQuestion(this._questionIndex, this._sectionIndex, 1);
    this.notifyChanges();
  }

  public getNonUsedQuestions() {
    return this.presetService.getNonUsedQuestions();
  }

  public changeIdentifier(identifier: string) {
    this._isTaggedQuestion = this.presetService.isTaggedQuestion(identifier);
    if (this._isTaggedQuestion) {
      this._question.controlType = this.presetService.getQuestionType(identifier);
    }
    this.notifyChanges();
  }

  public setColor(color: string, index: number) {
    this._question.options[index].color = color;
    this.notifyChanges();
  }

  public notifyChanges() {
    this.presetService.setNotifyChanges(true);
  }

  get language() { return this._language; }
  set language(value: 'en' | 'fr') { this._language = value; }
  get lang() { return this.translateService.currentLang; }

  get question(): Question { return this._question; }
  get customId(): string { return this._customId; }
  get isTaggedQuestion(): boolean { return this._isTaggedQuestion; }
  get innovation(): boolean { return  !!this.activatedRoute.snapshot.parent.data['innovation']; }

  get questionIndex(): number {
    return this._questionIndex;
  }

  get picto(): Picto {
    return this._picto;
  }

  get optionColors(): Array<string> {
    return this._optionColors;
  }

}
