import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Question, Option } from '../../../../../models/question';

@Component({
  selector: 'app-shared-preset-question',
  templateUrl: './shared-preset-question.component.html',
  styleUrls: ['./shared-preset-question.component.scss']
})
export class SharedPresetQuestionComponent {

  @Input() set question(question: Question) {
    if (question) {
      this._formData = this.formBuilder.group({
        identifier: new FormControl(question.identifier),
        controlType: new FormControl(question.controlType),
        label: this.formBuilder.group({
          en: new FormControl(question.label ? question.label.en : ''),
          fr: new FormControl(question.label ? question.label.fr : '')
        }),
        title: this.formBuilder.group({
          en: new FormControl(question.title ? question.title.en : ''),
          fr: new FormControl(question.title ? question.title.fr : '')
        }),
        subtitle: this.formBuilder.group({
          en: new FormControl(question.subtitle ? question.subtitle.en : ''),
          fr: new FormControl(question.subtitle ? question.subtitle.fr : '')
        }),
        canComment: new FormControl(question.canComment),
        options: this.formBuilder.array(
          Array.isArray(question.options) ?
            question.options.map(x => this.buildOptionForm(x))
            : []
        )
      });
    }
  }

  @Output() updateQuestion = new EventEmitter<Question>();
  @Output() clone = new EventEmitter<Question>();
  @Output() move = new EventEmitter<number>();

  private _formData: FormGroup;
  private _language: 'en' | 'fr' = 'en';
  private _editMode = false;

  constructor(private formBuilder: FormBuilder,
              private translateService: TranslateService) { }

  public save(event: Event) {
    event.preventDefault();
    if (this._formData.get('controlType').value === 'textarea') {
      // This block is here to avoid comments by default when creating a new quiz
      this._formData.get('canComment').setValue(false);
    }
    this.updateQuestion.emit(this._formData.value);
  }

  public removeQuestion(event: Event) {
    event.preventDefault();
    const res = confirm('Are you sure you want to delete this question?');
    if (res) {
      this.updateQuestion.emit(null);
      this._formData.reset();
    }
  }

  public cloneQuestion(event: Event) {
    event.preventDefault();
    this.clone.emit(this._formData.value);
  }

  private buildOptionForm(option: Option): FormGroup {
    return this.formBuilder.group( {
      identifier: new FormControl(option.identifier),
      label: this.formBuilder.group({
        en: new FormControl(option.label ? option.label.en : 'Option' + option.identifier),
        fr: new FormControl(option.label ? option.label.fr : 'Option' + option.identifier)
      }),
      color: new FormControl(option.color),
      positive: new FormControl(option.positive)
    });
  }

  public addNewOption(event: Event) {
    event.preventDefault();
    const optionsArray = this._formData.get('options') as FormArray;
    const stringId = Array.isArray(optionsArray.value) ? optionsArray.value.length.toString() : '0';
    const newOption = this.buildOptionForm({
      identifier: stringId,
      label: {
        en: 'Option' + stringId,
        fr: 'Option' + stringId
      },
      positive: false
    });
    optionsArray.push(newOption);
  }

  public deleteOption(event: Event, index: number) {
    event.preventDefault();
    const optionsArray = this._formData.get('options') as FormArray;
    optionsArray.removeAt(index);
    // re-index options to keep a count from 0 to X
    for (let i = index; i < optionsArray.value.length ; i++) {
      optionsArray.at(i).get('identifier').setValue(i.toString());
    }
  }

  public countErrors(lang: string) {
    let missing = 0;
    if (!this._formData.get('label.' + lang).value) { missing ++; }
    if (!this._formData.get('title.' + lang).value) { missing ++; }
    if (!this._formData.get('subtitle.' + lang).value) { missing ++; }
    return missing;
  }

  public up() {
    this.move.emit(-1);
  }

  public down() {
    this.move.emit(+1);
  }

  public get formData() { return this._formData; }

  get language() { return this._language; }
  set language(value: 'en' | 'fr') { this._language = value; }

  get editMode() { return this._editMode; }
  set editMode(value: boolean) { this._editMode = value; }

  get lang() { return this.translateService.currentLang; }

}
