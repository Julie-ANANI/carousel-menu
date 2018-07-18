import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from '../../../../../../models/question';

@Component({
  selector: 'app-admin-project-questionnaire-question',
  templateUrl: './admin-project-questionnaire-question.component.html',
  styleUrls: ['./admin-project-questionnaire-question.component.scss']
})
export class AdminProjectQuestionnaireQuestionComponent implements OnInit {

  @Input() question: Question;

  @Output() questionChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}
