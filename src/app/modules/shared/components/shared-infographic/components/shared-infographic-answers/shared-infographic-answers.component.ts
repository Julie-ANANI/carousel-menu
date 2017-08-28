import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-shared-infographic-answers',
  templateUrl: './shared-infographic-answers.component.html',
  styleUrls: ['./shared-infographic-answers.component.styl']
})
export class SharedInfographicAnswersComponent implements OnInit {

  @Input() public showDetails: boolean;
  @Input() public infographic: any;
  @Input() public question: any;

  constructor() { }

  ngOnInit() {
  }

  getAnswerToQuestion (answer) {
    for (const question of answer.questions) {
      if (this.question.id === question.id) {
        const type = this.question.answerType;
        let ans = question.answer;
        if (type === 'number') {
          ans = Number(ans);
        }
        else if (type === 'boolean') {
          ans = Boolean(ans);
        }
        return ans;
      }
    }
  }

  getAllAnswersToQuestion () {
    const answersObj = [];
    for (const answer of this.infographic.answers) {
      for (const question of answer.questions) {
        if (this.question.id === question.id) {
          answersObj.push(question.answer);
        }
      }
    }
    return answersObj;
  }

}
