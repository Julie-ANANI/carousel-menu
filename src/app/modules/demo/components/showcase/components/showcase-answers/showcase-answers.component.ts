import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TagStats } from '../../../../../../models/tag-stats';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { Answer } from '../../../../../../models/answer';

@Component({
  selector: 'app-showcase-answers[tagsStats]',
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
      this._answerService.getSectorAnswer(tags_id).subscribe((response) => {
        if (Array.isArray(response.result)) {
          this._answers = response.result;
          const staticAnswers = value.every((t) => t.static);
          if (!staticAnswers) {
            this._selectedAnswers = response.result.slice(0, 6);
            this._startLoading(this._selectedAnswers);
          }
        }
      });
    } else {
      this.topAnswersChange.emit([]);
    }

  }

  @Input() topAnswers: Array<Answer> = [];
  @Output() topAnswersChange: EventEmitter<Array<Answer>> = new EventEmitter<Array<Answer>>();

  private _answers: Array<Answer> = [];

  private _count: number;

  private _modalShow: boolean;

  private _selectedAnswers: Array<Answer> = [];

  constructor(private _answerService: AnswerService,
              private _authService: AuthService) {}


  private _startLoading(answers: Array<Answer>) {

    const topAnswers = answers.map((answer) => {
      answer.isLoading = true;
      setTimeout(() => {
        answer.isLoading = false;
      }, Math.floor(Math.random() * 1900));
      return answer;
    });
    this.topAnswersChange.emit(topAnswers);

  }


  public openModal(event: Event) {
    event.preventDefault();
    this._modalShow = true;
  }


  public activeAnswer(value: Answer) {
    return this._selectedAnswers.some((item: Answer) => item._id === value._id);
  }


  public onChangeAnswer(event: Event, answer: Answer) {
    if ((event.target as HTMLInputElement).checked) {
      this._selectedAnswers.push(answer);
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

  get modalShow(): boolean {
    return this._modalShow;
  }

  set modalShow(value: boolean) {
    this._modalShow = value;
  }

  get count(): number {
    return this._count;
  }

  get isAdmin(): boolean {
    return this._authService.isAdmin;
  }

}
