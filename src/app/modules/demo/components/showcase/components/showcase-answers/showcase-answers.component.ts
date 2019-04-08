import { Component, Input } from '@angular/core';
import {TagStats} from '../../../../../../models/tag-stats';
import {Answer} from '../../../../../../models/answer';
import {AnswerService} from '../../../../../../services/answer/answer.service';

@Component({
  selector: 'app-showcase-answers',
  templateUrl: './showcase-answers.component.html',
})

export class ShowcaseAnswersComponent {

  @Input() totalAnswers: number;

  @Input() set tagsStats(value: Array<TagStats>) {
    const tags_id = value.map((st) => st.tag._id);
    if (tags_id.length > 0) {
      this.answerService.getStarsAnswer(tags_id).subscribe((next) => {
        if (Array.isArray(next.result)) {
          this._answers = next.result;
          this._topAnswers = next.result.slice(0, 6);
        }
      });
    } else {
      this._topAnswers = [];
    }
  }
  public openAnswersModal = false;

  private _answers: Array<Answer> = [];
  private _topAnswers: Array<Answer> = [];

  constructor(private answerService: AnswerService) {}

  get answers() {
    return this._answers;
  }

  get topAnswers() {
    return this._topAnswers;
  }

}
