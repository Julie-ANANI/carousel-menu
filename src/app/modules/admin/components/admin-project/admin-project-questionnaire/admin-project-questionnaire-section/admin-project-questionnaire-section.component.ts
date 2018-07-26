///<reference path="../../../../../../../../node_modules/@angular/forms/src/form_builder.d.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Question} from '../../../../../../models/question';



@Component({
  selector: 'app-admin-project-questionnaire-section',
  templateUrl: './admin-project-questionnaire-section.component.html',
  styleUrls: ['./admin-project-questionnaire-section.component.scss']
})
export class AdminProjectQuestionnaireSectionComponent implements OnInit {

  @Input() set section(sec) {
    this._section = sec;
  }
  @Input() state: any;
  @Output() sectionUpdated = new EventEmitter<any>();
  @Output() sectionRemoved = new EventEmitter<any>();
  @Output() stateOut = new EventEmitter<any>();
  @Output() move = new EventEmitter<any>();
  @Output() questionAdded = new EventEmitter<any>();
  @Output() questionRemoved = new EventEmitter<any>();
  @Output() questionUpdated = new EventEmitter<any>();
  @Output() questionMoved = new EventEmitter<any>();

  public editName = false;
  private _newQuestion: Question;
  private _section: any;
  public formData: FormGroup;
  constructor( private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formData = this._formBuilder.group({
      description: [this._section.description]
    });
  }

  public updateDescription(event: any) {
    console.log(event);
    this._section.description = event;
    this._emit();
  }

  public removeSection() {
    this.sectionRemoved.emit(this._section);
  }

  public updateQuestion(event: any, index: number) {
    this._section.questions[index] = event;
    this.questionUpdated.emit(this._section.questions[index]);
    this._emit();
  }

  public removeQuestion(quest: any, index: number) {
    this.questionRemoved.emit(quest);
    this._section.questions.splice(index, 1);
    this._emit();
  }

  public update() {
    this._emit();
  }

  public addQuestion() {
    this._newQuestion = {
      label: {
        en: 'Question',
        fr: ''
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

    this.questionAdded.emit(this._newQuestion);
  }



  private _emit() {
    this.sectionUpdated.emit(this._section);
  }

  get section() {
    return this._section;
  }

  public questionState(event: any) {
    this.state.quest = event;
    this._emitState();
  }

  public cloneQuestion(event: any, index: number) {
    delete event._id;
    event.identifier += ' Cloned';
    this._section.questions.splice(index + 1, 0, event);
    this.state.quest.splice(index + 1, 0, true); //UX
    this._emitState();
    this._emit();
  }
  private _emitState() {
    this.stateOut.emit(this.state);
  }

  public moveQuestion(event: any, index: number) {

    const newIndex = event === 'down' ? index + 1 : index - 1;
    if (newIndex >= this._section.questions.length || newIndex < 0) {
      this.questionMoved.emit([index, event]);
    } else {
      const tempSec = JSON.parse(JSON.stringify(this._section.questions[index]));
      this._section.questions[index] = JSON.parse(JSON.stringify(this._section.questions[newIndex]));
      this._section.questions[newIndex] = tempSec;
      const tempState = JSON.parse(JSON.stringify(this.state.quest[index]));
      this.state.quest[index] = JSON.parse(JSON.stringify(this.state.quest[newIndex]));
      this.state.quest[newIndex] = tempState
      this._emitState();
      this._emit();
    }
  }

  public up() {
    this.move.emit('up');
  }
  public down() {
    this.move.emit('down');
  }
}
