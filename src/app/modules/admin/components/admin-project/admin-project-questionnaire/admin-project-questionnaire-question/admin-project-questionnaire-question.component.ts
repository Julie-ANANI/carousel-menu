import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Question } from '../../../../../../models/question';

@Component({
  selector: 'app-admin-project-questionnaire-question',
  templateUrl: './admin-project-questionnaire-question.component.html',
  styleUrls: ['./admin-project-questionnaire-question.component.scss']
})
export class AdminProjectQuestionnaireQuestionComponent {

  @Input() set question(question: Question) {
    this._question = question;
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
      options: this.formBuilder.array([])
    });
  }

  @Output() updateQuestion = new EventEmitter<Question>();
  @Output() clone = new EventEmitter<Question>();
  @Output() move = new EventEmitter<number>();

  private _question: Question;
  private _formData: FormGroup;

  private _language: 'en' | 'fr' = 'en';

  constructor(private formBuilder: FormBuilder) { }

  public removeQuestion(event: Event) {
    event.preventDefault();
    this._question = null;
    this.updateQuestion.emit(this._question);
  }

  public cloneQuestion(event: Event) {
    event.preventDefault();
    this.clone.emit(this.question);
  }

  public addOption() {
    const optionsArray = this._formData.get('options') as FormArray;
    const stringId = Array.isArray(optionsArray.value) ? optionsArray.value.length.toString() : '0';
    const newOption = this.formBuilder.group( {
      identifier: new FormControl(stringId),
      label: this.formBuilder.group({
        en: new FormControl('Option' + stringId),
        fr: new FormControl('Option' + stringId)
      }),
      color: new FormControl(),
      positive: new FormControl(false)
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

}
