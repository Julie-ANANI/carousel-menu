import { Component, Input } from '@angular/core';
import { TagStats } from '../../../../../../models/tag-stats';
import { Answer } from '../../../../../../models/answer';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { AuthService } from '../../../../../../services/auth/auth.service';

@Component({
  selector: 'app-showcase-answers',
  templateUrl: './showcase-answers.component.html',
  styleUrls: ['./showcase-answers.component.scss']
})

export class ShowcaseAnswersComponent {

  @Input() set totalAnswers(value: number) {
    this.count = value;
  }

  @Input() set tagsStats(value: Array<TagStats>) {
    const tags_id = value.map((st) => st.tag._id);

    if (tags_id.length > 0) {
      this._answerService.getStarsAnswer(tags_id).subscribe((response) => {
        if (Array.isArray(response.result)) {
          this._answers = response.result;
          this._topAnswers = response.result.slice(0, 6);

          this._topAnswers = this._topAnswers.map((answer) => {
            answer.isLoading = true;
            return answer;
          });

          this._topAnswers.forEach((answer, index) => {
            this._stopLoading(answer, index);
          });

        }
      });
    } else {
      this._topAnswers = [];
    }

  }

  private _answers: Array<Answer> = [];

  private _topAnswers: Array<any> = [];

  count: number;

  adminPass: boolean = false;

  constructor(private _answerService: AnswerService,
              private _authService: AuthService) {

    this.adminPass = this._authService.adminLevel > 2

  }


  private _stopLoading(answer: any, index: number) {
    setTimeout(() => {
      answer.isLoading = false;
      this._topAnswers[index] = answer;
    }, Math.floor(Math.random() * 2000) + 1000);
  }


  get answers() {
    return this._answers;
  }

  get topAnswers() {
    return this._topAnswers;
  }

}
