import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from '../../../../../../models/question';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-admin-project-questionnaire-question',
  templateUrl: './admin-project-questionnaire-question.component.html',
  styleUrls: ['./admin-project-questionnaire-question.component.scss']
})
export class AdminProjectQuestionnaireQuestionComponent implements OnInit {

  @Input() question: Question;

  @Output() questionChange = new EventEmitter<any>();

  public isCollapsed = true;
  public formData: FormGroup;

  constructor( private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formData = this._formBuilder.group({
      controlType: [this.question.controlType]
    });
  }


  public updateType(event: any) {
    this.question.controlType = event;

  }




}
