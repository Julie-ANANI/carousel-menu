import { Component, Input } from '@angular/core';
import { TagStats } from '../../../../../../models/tag-stats';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Answer } from '../../../../../../models/answer';

@Component({
  selector: 'app-showcase-answers',
  templateUrl: './showcase-answers.component.html',
  styleUrls: ['./showcase-answers.component.scss']
})

export class ShowcaseAnswersComponent {

  @Input() set totalAnswers(value: number) {
    this._count = value;
  }

  @Input() set tagsStats(value: Array<TagStats>) {
    const tags_id = value.map((st) => st.tag._id);

    if (tags_id.length > 0) {
      this._answerService.getStarsAnswer(tags_id).subscribe((response) => {
        if (Array.isArray(response.result)) {
          this._answers = response.result;
          this._selectedAnswers = response.result.slice(0, 6);
          this._startLoading(this._selectedAnswers);
        }
      });
    } else {
      this._topAnswers = [];
    }

  }

  private _answers: Array<Answer> = [];

  private _topAnswers: Array<Answer> = [];

  private _count: number;

  private _adminPass: boolean = false;

  private _modalShow: boolean = false;

  private _selectedAnswers: Array<Answer> = [];

  constructor(private _answerService: AnswerService,
              private _authService: AuthService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._adminPass = this._authService.adminLevel > 2;

  }


  private _startLoading(answers: Array<Answer>) {

    this._topAnswers = answers.map((answer) => {
      answer.isLoading = true;
      return answer;
    });

    this._stopLoading(this._topAnswers);

  }


  private _stopLoading(answers: Array<Answer>) {
    if (answers.length) {
      answers.forEach((answer, index) => {
        setTimeout(() => {
          answer.isLoading = false;
          this._topAnswers[index] = answer;
        }, Math.floor(Math.random() * 100) + 100);
      });
    }
  }


  public openModal(event: Event) {
    event.preventDefault();
    this._modalShow = true;
  }


  public activeAnswer(value: Answer) {
    return this._selectedAnswers.some((item: Answer) => item._id === value._id);
  }


  public onChangeAnswer(event: Event, answer: Answer) {
    if (event.target['checked']) {
      if (this._selectedAnswers.length < 6) {
        this._selectedAnswers.push(answer);
      } else {
        this._translateNotificationsService.error('ERROR.ERROR_EN', 'You can only select 6 answers.');
      }
    } else {
      this._selectedAnswers = this._selectedAnswers.filter((item: Answer) => item._id !== answer._id);
    }
  }


  public onClickApply(event: Event) {
    event.preventDefault();
    this._startLoading(this._selectedAnswers);
    this._modalShow = false;
  }

  get answers() {
    return this._answers;
  }

  get topAnswers() {
    return this._topAnswers;
  }

  get modalShow(): boolean {
    return this._modalShow;
  }

  set modalShow(value: boolean) {
    this._modalShow = value;
  }

  get count(): number {
    return this._count;
  }

  get adminPass(): boolean {
    return this._adminPass;
  }

  get selectedAnswers(): Array<Answer> {
    return this._selectedAnswers;
  }

}
