import {Component, Input, OnInit} from '@angular/core';
import {Question} from '../../../../../../models/question';

@Component({
  selector: 'app-admin-project-questionnaire-question',
  templateUrl: './admin-project-questionnaire-question.component.html',
  styleUrls: ['./admin-project-questionnaire-question.component.scss']
})
export class AdminProjectQuestionnaireQuestionComponent implements OnInit {

  @Input() question: Question;
  constructor() { }

  ngOnInit() {
    console.log(this.question);
  }

}
