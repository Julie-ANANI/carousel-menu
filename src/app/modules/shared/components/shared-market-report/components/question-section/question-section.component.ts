import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Answer} from '../../../../../../models/answer';
import {Question} from '../../../../../../models/question';
import {Innovation} from '../../../../../../models/innovation';
import {Tag} from '../../../../../../models/tag';
import {ResponseService} from '../../services/response.service';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs';
import {AnswersStats} from '../../models/stats';

@Component({
  selector: 'app-question-section',
  templateUrl: 'question-section.component.html',
  styleUrls: ['question-section.component.scss']
})

export class QuestionSectionComponent implements OnInit {

  @Input() innovation: Innovation = <Innovation>{};

  @Input() readonly = true;

  @Input() hideAnswers = true;

  @Input() canEditQuestionTags = false;

  @Input() questionReceived: Question = <Question>{};

  @Input() set answers(value: Array<Answer>) {
    this._answersReceived = value;
    this._updateAnswersData();
  }

  @Input() set toggleAnswers(value: boolean) {
    this._toggleAnswers = value;
    this._showComment = value;
  }

  @Output() modalAnswerChange = new EventEmitter<any>();

  @Output() executiveTags = new EventEmitter<Array<Tag>>();

  @Output() questionChanged = new EventEmitter<Question>();

  private _answersReceived: Array<Answer> = [];

  private _toggleAnswers = false;

  private _answersWithComment: Array<Answer> = [];

  private _stats: AnswersStats = null;

  private _showComment = false;

  constructor(private _responseService: ResponseService,
              private _dataService: DataService) { }

  ngOnInit() {
    this._updateAnswersData();
  }

  /* Update Answers Data */
  private _updateAnswersData() {
    if (this.questionReceived && this.questionReceived.identifier) {

      const answersToShow = this._responseService.answersToShow(this._answersReceived, this.questionReceived);
      this._dataService.setAnswers(this.questionReceived, answersToShow);

      // filter comment answers
      this._answersWithComment = ResponseService.filterCommentAnswers(this.questionReceived, this._answersReceived);

      // sort comments
      this._answersWithComment = ResponseService.sortComments(this.questionReceived, this._answersWithComment);

      this._stats = {
        nbAnswers: answersToShow.length,
        percentage: Math.round((answersToShow.length * 100) / this._answersReceived.length)
      };

    }
  }

  public updateNumberOfItems(event: number): void {
    this._stats = {...this._stats, nbAnswers: event};
  }

  public seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }

  public answerBtnClicked(event: boolean) {
    this._showComment = event;
  }

  get showComment(): boolean {
    return this._showComment;
  }

  get toggleAnswers(): boolean {
    return this._toggleAnswers;
  }

  get answersToShow(): Observable<Array<Answer>> {
    return this._dataService.getAnswers(this.questionReceived);
  }

  get answersWithComment(): Array<Answer> {
    return this._answersWithComment;
  }

  get stats(): AnswersStats {
    return this._stats;
  }

}
