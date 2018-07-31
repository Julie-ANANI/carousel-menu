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

  private _section: Section;
  private _formData: FormGroup;

  public editSection = false;

  constructor( private _formBuilder: FormBuilder) {}

  save(event: Event) {
    event.preventDefault();
    this.updateSection.emit({...this._section, ...this._formData.value});
  }

  public addQuestion() {
    console.log('TODO');
  }

  public up(): void {
    this.move.emit(-1);
  }

  public down(): void {
    this.move.emit(+1);
  }

  public removeSection(event: Event): void {
    event.preventDefault();
    this._section = null;
    this.updateSection.emit(this._section);
  }

  public cloneQuestion(event: any, index: number) {
    delete event._id;
    event.identifier += 'Cloned';
    this._section.questions.splice(index + 1, 0, event);
  }

  public moveQuestion(move: number, index: number) {
    const new_place = index + move;
    const questions = this._section.questions;
    if (new_place >= 0 && new_place < questions.length) {
      questions[new_place] = questions.splice(index, 1, questions[new_place])[0];
      this.updateSection.emit(this._section);
    }
  }

  public get questions(): Array<Question> { return this._section.questions; }
  public get formData() { return this._formData; }
}
