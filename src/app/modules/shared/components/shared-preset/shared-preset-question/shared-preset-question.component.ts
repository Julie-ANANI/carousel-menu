import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PresetService } from '../services/preset.service';
import { Question } from '../../../../../models/question';

@Component({
  selector: 'app-shared-preset-question',
  templateUrl: './shared-preset-question.component.html',
  styleUrls: ['./shared-preset-question.component.scss']
})
export class SharedPresetQuestionComponent {

  @Input() set question(value: Question) {
    this._question = value;
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
  public editMode = false;

  private _language: 'en' | 'fr' = 'en';

  constructor(private presetService: PresetService,
              private translateService: TranslateService) { }

  public removeQuestion(event: Event) {
    event.preventDefault();
    const res = confirm('Are you sure you want to delete this question ?');
    if (res) {
      this.presetService.removeQuestion(this._questionIndex, this._sectionIndex);
    }
  }

  public cloneQuestion(event: Event) {
    event.preventDefault();
    this.presetService.cloneQuestion(this._questionIndex, this._sectionIndex);
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
  }

  public deleteOption(event: Event, index: number) {
    event.preventDefault();
    const options = this._question.options;
    options.splice(index, 1);
    // re-index options to keep a count from 0 to X
    options.forEach(function (option, i) {
      option.identifier = i.toString();
    });
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
  }

  public down(event: Event) {
    event.preventDefault();
    this.presetService.moveQuestion(this._questionIndex, this._sectionIndex, 1);
  }

  get language() { return this._language; }
  set language(value: 'en' | 'fr') { this._language = value; }
  get lang() { return this.translateService.currentLang; }

  get question(): Question { return this._question; }

}
