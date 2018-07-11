import { Component, Input, OnInit } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { Question } from '../../../../../../models/question';

@Component({
  selector: 'app-admin-stats',
  templateUrl: 'admin-stats.component.html',
  styleUrls: ['admin-stats.component.scss']
})
export class AdminStatsComponent implements OnInit {

  @Input() public answers: Array<Answer>;
  @Input() public question: Question;

  constructor() { }

  ngOnInit() {
    this.answers.reduce((prev, ans) => {
      const answerValue = ans.answers[this.question.identifier];
      if (answerValue) {
        // create set of uniques tags, no need to tag twice
        const tags = new Set([...ans.tags, ...ans.answerTags[this.question.identifier], ...ans.professional.tags]);
        tags.forEach((tag) => {
          if (tag) { // prevent undefined tags
            if (prev[tag._id]) {
              prev[tag._id] = [...prev[tag._id], answerValue];
            } else {
              prev[tag._id] = [answerValue];
            }
          }
        });
      }
      return prev;
    }, {});
  }

}
