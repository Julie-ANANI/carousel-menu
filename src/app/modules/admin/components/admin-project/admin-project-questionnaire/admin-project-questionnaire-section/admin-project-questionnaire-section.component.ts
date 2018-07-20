///<reference path="../../../../../../../../node_modules/@angular/forms/src/form_builder.d.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
  @Output() sectionUpdated = new EventEmitter<any>();


  private _section: any;
  public formData: FormGroup;
  public isCollapsed = true;
  public modalQuestionBuild = false;
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
  }

  public updateDescription(event: any) {
    this._section.description = event;
    this._emit();
  }

  public updateQuestion(event: any) {
    this._section.questions[this._findQuestionIndex(event)] = event;
    this._emit();
  }

  public addQuestion() {
    this.modalQuestionBuild = true;
  }

  private _emit() {
    this.sectionUpdated.emit(this._section);
  }

  get section() {
    return this._section;
  }
}
