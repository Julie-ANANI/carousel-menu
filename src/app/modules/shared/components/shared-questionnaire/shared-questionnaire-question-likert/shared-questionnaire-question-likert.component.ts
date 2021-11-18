import {Component, Input, OnInit} from '@angular/core';
import {MissionQuestion} from "../../../../../models/mission";


@Component({
  selector: 'app-shared-questionnaire-question-likert',
  templateUrl: './shared-questionnaire-question-likert.component.html',
  styleUrls: ['./shared-questionnaire-question-likert.component.scss']
})
export class SharedQuestionnaireQuestionLikertComponent implements OnInit {

  // @Input() question: MissionQuestion;
  private _question: MissionQuestion = <MissionQuestion>{};

  public measuresOptions = {
    'agreement': ['Strongly disagree', 'disagree'],
    'frequency': ['Strongly disagree', 'disagree'],
    'satisfaction': ['Strongly disagree', 'disagree'],
    'use': ['Strongly disagree', 'disagree'],
    'quality': ['Strongly disagree', 'disagree'],
    'relevance': ['Never', 'Rarely']
  };

  constructor() {
  }

/*  public choseMeasure(choice: unknown) {
    if (choice === 'agreement') {
      //return [this.agreement];
    }
    if (choice === 'frequency') {
      return [this.frequency];
    }
  }*/

  ngOnInit() {
  }

  @Input() get question(): MissionQuestion {
    return this._question;
  }
}
