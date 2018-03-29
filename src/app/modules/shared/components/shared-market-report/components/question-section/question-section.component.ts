/**
 * Created by bastien on 16/11/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Question } from '../../../../../../models/question';
import * as _ from 'lodash';

@Component({
  selector: 'app-question-section',
  templateUrl: 'question-section.component.html',
  styleUrls: ['question-section.component.scss']
})

export class QuestionSectionComponent implements OnInit {

  private _domSectionId: string;
  private _showDetails: boolean;
  private _answersWithComment: Array<Answer> = [];
  private _answersToShow: Array<Answer> = [];
  private _readonly: boolean;
  private _maxCountScore: number;
  private _innoid: string;

  @Input() set showDetails(value: boolean) {
    this._showDetails = value;
  }
  @Input() set readonly(value: boolean) {
    this._readonly = value;
  }
  @Output() modalAnswerChange = new EventEmitter<any>();
  @Input() public answers: Array<Answer>;
  @Input() public question: Question;
  @Input() public info: any;


  constructor(private _translateService: TranslateService,
              private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this._innoid = params['projectId'];
    });

    this._domSectionId = this.info.id.replace(/\s/g, '');

    this._answersToShow = this.answers
      .filter((a) => (a.answers[this.info.id] && a.answers[this.info.id + 'Quality'] !== 0));

    this._answersWithComment = this.answers
      .filter((a) => (a.answers[this.info.id + 'Comment'] && a.answers[this.info.id + 'CommentQuality'] !== 0))
      .sort((a, b) => {
        if (b.answers[this.info.id + 'CommentQuality'] - a.answers[this.info.id + 'CommentQuality'] === 0) {
          return b.answers[this.info.id + 'Comment'].length - a.answers[this.info.id + 'Comment'].length;
        } else {
          return b.answers[this.info.id + 'CommentQuality'] - a.answers[this.info.id + 'CommentQuality'];
        }
      });

    switch (this.info.controlType) {
      case 'scale':
        // Calcul du score max
        const max = _.maxBy(this.info.data, 'count') || {};
        this._maxCountScore = max['count'] || 0;
    }
  }

  public seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }

  public toggleDetails(event: Event) {
    event.preventDefault();
    this._showDetails = !this._showDetails;
  }

  public getAnswers(commentsList: Array<any>): Array<Answer> {
    if (this.answers) {
      const answers = _.map(commentsList, (comment: any) => _.find(this.answers, (answer: Answer) => answer._id === comment.answerId));
      return _.filter(answers, (a: Answer) => a);
    } else {
      return [];
    }
  }

  public getFillPerc(value: number): string {
    return `${Math.round(value / this._maxCountScore * 100)}%`;
  }

  get readonly(): boolean { return this._readonly; }
  get domSectionId(): string { return this._domSectionId; }
  get showDetails(): boolean { return this._showDetails; }
  get answersToShow(): Array<Answer> { return this._answersToShow; }
  get answersWithComment(): Array<Answer> { return this._answersWithComment; }
  get innoid(): string { return this._innoid; }
  set innoid(value: string) { this._innoid = value; }
  get lang(): any { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
