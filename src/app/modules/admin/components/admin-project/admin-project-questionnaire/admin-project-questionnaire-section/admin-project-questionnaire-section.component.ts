///<reference path="../../../../../../../../node_modules/@angular/forms/src/form_builder.d.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Question} from '../../../../../../models/question';
// import {Multiling} from '../../../../../../models/multiling';
// import {Section} from '../../../../../../models/section';


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

  public editName = false;
  private _newQuestion: Question;
  private _section: any;
  public formData: FormGroup;
  public isCollapsed = true;
  constructor( private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formData = this._formBuilder.group({
      description: [this._section.description]
    });
  }

  private _findQuestionIndex(question: any): number {
    let k = 0;
    for (const q of this._section.questions) {
      if (q.identifier === question.identifier) {
        return k;
      }
      k++;
    }
    return k;
  }

  public updateDescription(event: any) {
    console.log(event);
    this._section.description = event;
    this._emit();
  }

  public removeSection() {
    this.sectionRemoved.emit(this._section);
  }

  public updateQuestion(event: any) {
    this._section.questions[this._findQuestionIndex(event)] = event;
    this.questionUpdated.emit(this._section.questions[this._findQuestionIndex(event)]);
    this._emit();
  }

  public removeQuestion(quest: any) {
    this.questionRemoved.emit(quest);
    this._section.questions.splice(this._findQuestionIndex(quest), 1);
    this._emit();
  }

  public update() {
    console.log(this._section);
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
      canComment: true
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

  public coolapse() {
    this.isCollapsed = !this.isCollapsed;
    this.state.sec = !this.isCollapsed;
    this._emitState();
  }

  public cloneQuestion(event: any) {

    delete event._id;
    event.identifier += ' Cloned';
    this._section.questions.push(event);
    this.state.quest.push(true); //UX
    this._emitState();
    this._emit();
  }
  private _emitState() {
    this.stateOut.emit(this.state);
  }

  public moveQuestion(event: any, index: number) {
    if (event === 'down') {
      if (index + 1 === this._section.questions.length) {
        console.log('changement de section ?')
      } else {
        const tempquest = JSON.parse(JSON.stringify(this._section.questions[index]));
        this._section.questions[index] = JSON.parse(JSON.stringify(this._section.questions[index + 1]));
        this._section.questions[index + 1] = tempquest;
        const tempstate = JSON.parse(JSON.stringify(this.state.quest[index]));
        this.state.quest[index] = JSON.parse(JSON.stringify(this.state.quest[index + 1]));
        this.state.quest[index + 1] = tempstate;
        this._emitState();
        this._emit();
      }
    }
    if (event === 'up') {
      if (index === 0) {
        console.log('changement de section ?')
      } else {
        const tempquest = JSON.parse(JSON.stringify(this._section.questions[index]));
        this._section.questions[index] = JSON.parse(JSON.stringify(this._section.questions[index - 1]));
        this._section.questions[index - 1] = tempquest;
        const tempstate = JSON.parse(JSON.stringify(this.state.quest[index]));
        this.state.quest[index] = JSON.parse(JSON.stringify(this.state.quest[index - 1]));
        this.state.quest[index - 1] = tempstate;
        this._emitState();
        this._emit();
      }
    }
  }

  public up() {
    this.move.emit('up');
  }
  public down() {
    this.move.emit('down');
  }

  get newQuestion() {
    return this._newQuestion;
  }
}
