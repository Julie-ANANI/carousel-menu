import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Question } from '../../../../../models/question';
import { Section } from '../../../../../models/section';

@Component({
  selector: 'app-shared-preset-section',
  templateUrl: './shared-preset-section.component.html',
  styleUrls: ['./shared-preset-section.component.scss']
})
export class SharedPresetSectionComponent {

  @Input() set section(section: Section) {
    this._formData = this._formBuilder.group({
      label: this._formBuilder.group({
        en: new FormControl(section.label ? section.label.en : ''),
        fr: new FormControl(section.label ? section.label.fr : '')
      }),
      description: new FormControl(section.description),
    });
    this._questions = section.questions;
  }

  @Output() move = new EventEmitter<number>();
  @Output() updateSection = new EventEmitter<Section>();

  private _questions: Array<Question>;
  private _formData: FormGroup;

  public editSection = false;

  constructor( private _formBuilder: FormBuilder) {}

  private update() {
    this.updateSection.emit({...this._formData.value, questions: this._questions});
  }

  public save(event: Event) {
    event.preventDefault();
    this.update();
  }

  private generateQuestionId(): string {
    // Generate a random id for each question
    return Math.random().toString(36).substring(2);
  }

  public addNewQuestion(event: Event) {
    event.preventDefault();
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
      identifier: this.generateQuestionId(),
      controlType: 'checkbox',
      canComment: true,
      options: []
    };
    this._questions.push(newQuestion);
    this.update();
  }

  public up(): void {
    this.move.emit(-1);
  }

  public down(): void {
    this.move.emit(+1);
  }

  public removeSection(event: Event): void {
    event.preventDefault();
    const res = confirm('Are you sure you want to delete this section?');
    if (res) {
      this.updateSection.emit(null);
      this._formData.reset();
    }
  }

  public updateQuestion(question: Question, index: number) {
    if (question) {
      // Update question
      this._questions[index] = question;
    } else {
      // delete question
      this._questions.splice(index, 1);
    }
    this.update();
  }

  public cloneQuestion(question: Question, index: number) {
    // avoid getting twice the same question id
    const newQuestion = {...question, identifier: this.generateQuestionId()};
    this._questions.splice(index + 1, 0, newQuestion);
    this.update();
  }

  public moveQuestion(move: number, index: number) {
    const new_place = index + move;
    const questions = this._questions;
    if (new_place >= 0 && new_place < questions.length) {
      questions[new_place] = questions.splice(index, 1, questions[new_place])[0];
      this.update();
    }
  }

  public get questions(): Array<Question> { return this._questions; }
  public get formData() { return this._formData; }
}
