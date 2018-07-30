///<reference path="../../../../../../../../node_modules/@angular/forms/src/form_builder.d.ts"/>
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Question } from '../../../../../../models/question';
import { Section } from '../../../../../../models/section';

@Component({
  selector: 'app-admin-project-questionnaire-section',
  templateUrl: './admin-project-questionnaire-section.component.html',
  styleUrls: ['./admin-project-questionnaire-section.component.scss']
})
export class AdminProjectQuestionnaireSectionComponent {

  @Input() set section(section: Section) {
    this._section = section;
    this._formData = this._formBuilder.group({
      label: this._formBuilder.group({
        en: new FormControl(this._section.label ? this._section.label.en : ''),
        fr: new FormControl(this._section.label ? this._section.label.fr : '')
      }),
      description: new FormControl(this._section.description),
    });
  }

  @Output() move = new EventEmitter<number>();
  @Output() updateSection = new EventEmitter<Section>();

  private _section: any;
  private _formData: FormGroup;

  public editSection = false;

  constructor( private _formBuilder: FormBuilder) {}

  save(event: Event) {
    event.preventDefault();
    this.updateSection.emit({...this._section, ...this._formData.value});
  }

  public addQuestion() {
    const newQuestion: Question = {
      label: {
        en: 'Question',
        fr: 'Question'
      },
      title: {
        en: '',
        fr: ''
      },
      subtitle: {
        en: '',
        fr: ''
      },
      identifier: this._section.name + this._section.questions.length.toString(),
      controlType: 'checkbox',
      canComment: true,
      options: []
    };
    console.log(newQuestion);
  }

  public up(): void {
    this.move.emit(-1);
  }

  public down(): void {
    this.move.emit(+1);
  }

  public removeSection(): void {
    this._section = null;
    this.updateSection.emit(this._section);
  }

  public cloneQuestion(event: any, index: number) {
    delete event._id;
    event.identifier += 'Cloned';
    this._section.questions.splice(index + 1, 0, event);
    // this.state.quest.splice(index + 1, 0, true);
  }

  public moveQuestion(event: any, index: number) {
    const newIndex = event === 'down' ? index + 1 : index - 1;
    if (newIndex >= this._section.questions.length || newIndex < 0) {
      // this.questionMoved.emit([index, event]);
    } else {
      const tempSec = JSON.parse(JSON.stringify(this._section.questions[index]));
      this._section.questions[index] = JSON.parse(JSON.stringify(this._section.questions[newIndex]));
      this._section.questions[newIndex] = tempSec;
      // const tempState = JSON.parse(JSON.stringify(this.state.quest[index]));
      // this.state.quest[index] = JSON.parse(JSON.stringify(this.state.quest[newIndex]));
      // this.state.quest[newIndex] = tempState;
    }
  }

  public get questions() { return this._section.questions; }
  public get formData() { return this._formData; }
}
