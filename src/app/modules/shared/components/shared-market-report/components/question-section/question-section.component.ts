import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from '../../services/filters.service';
import { Answer } from '../../../../../../models/answer';
import { Question } from '../../../../../../models/question';
import { Innovation } from '../../../../../../models/innovation';
import { Tag } from '../../../../../../models/tag';

@Component({
  selector: 'app-question-section',
  templateUrl: 'question-section.component.html',
  styleUrls: ['question-section.component.scss']
})

export class QuestionSectionComponent implements OnInit {

  private _answers: Array<Answer>;
  private _showComments: boolean;
  private _showDetails: boolean;
  private _answersWithComment: Array<Answer> = [];
  private _answersToShow: Array<Answer> = [];
  private _readonly: boolean;
  private _tagId: string;
  private _tags: Array<Tag>;
  private _stats: {nbAnswers?: number, percentage?: number};
  private _showComment: boolean;

  @Input() selectedTag: any;
  @Input() public question: Question;
  @Input() public innovation: Innovation;

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this.updateAnswersData();
  }

  @Input() set showComments(value: boolean) {
    this._showComments = value;
  }

  @Input() set showDetails(value: boolean) {
    this._showDetails = value;
    this._showComment = value;
  }

  @Input() set readonly(value: boolean) {
    this._readonly = value;
  }

  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(private _translateService: TranslateService,
              private filterService: FilterService) {}

  ngOnInit() {
    this._tagId = this.question.identifier + (this.question.controlType !== 'textarea' ? 'Comment' : '');
    this.updateAnswersData();
  }

  private updateAnswersData() {
    if (this.question && this.question.identifier) {
      const id = this.question.identifier;

      this._answersToShow = this._answers.filter((a) => (a.answers[id]));
      switch (this.question.controlType) {
        case 'clearbit':
          break;
        case 'list':
          break;
        case 'checkbox':
          // We filter the answers with only falses items
          this._answersToShow = this._answersToShow
            .filter((a) => Object.keys(a.answers[id]).some((k) => a.answers[id][k]));
          break;
        case 'textarea':
          // sort textarea answers by quality and by length.
          this._answersToShow = this._answersToShow
            .filter((a) => (a.answers[id + 'Quality'] !== 0))
            .sort((a, b) => {
              if ((b.answers[id + 'Quality'] || 1) - (a.answers[id + 'Quality'] || 1) === 0) {
                return b.answers[id].length - a.answers[id].length;
              } else {
                return (b.answers[id + 'Quality'] || 1) - (a.answers[id + 'Quality'] || 1);
              }
            });
          break;
        default:
          this._answersToShow = this._answersToShow.filter((a) => (a.answers[id + 'Quality'] !== 0));
      }

      // calculate tags list
      this._tags = this._answersToShow.reduce((tagsList, answer) => {
        const answerTags = answer.answerTags[this._tagId];
        if (Array.isArray(answerTags)) {
          answerTags.forEach((t) => {
            const previousTag = tagsList.find((t2) => t2._id === t._id);
            if (previousTag) {
              previousTag['count'] += 1;
            } else {
              t['count'] = 1;
              tagsList.push(t);
            }
          });
        }
        return tagsList;
      }, []).sort((a, b) => b.count - a.count);

      // filter comments
      switch (this.question.controlType) {
        case 'checkbox':
          this._answersWithComment = this._answers.filter(function(a) {
            return !(a.answers[id] && Object.keys(a.answers[id]).some((k) => a.answers[id][k]))
              && a.answers[id + 'Comment']
              && a.answers[id + 'CommentQuality'] !== 0;
          });
          break;
        case 'radio':
          this._answersWithComment = this._answers.filter(function(a) {
            return !a.answers[id]
            && a.answers[id + 'Comment']
            && a.answers[id + 'CommentQuality'] !== 0
          });
          break;
        default:
          this._answersWithComment = this._answers.filter(function(a) {
            return a.answers[id + 'Comment']
              && a.answers[id + 'CommentQuality'] !== 0
          });
      }
      // sort comments
      this._answersWithComment = this._answersWithComment
        .sort((a, b) => {
          if ((b.answers[id + 'CommentQuality'] || 1) - (a.answers[id + 'CommentQuality'] || 1) === 0) {
            return b.answers[id + 'Comment'].length - a.answers[id + 'Comment'].length;
          } else {
            return (b.answers[id + 'CommentQuality'] || 1) - (a.answers[id + 'CommentQuality'] || 1);
          }
        });

      this._stats = {
        nbAnswers: this._answersToShow.length,
        percentage: Math.round((this._answersToShow.length * 100) / this.answers.length)
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

  public addTagFilter(event: Event, tag: Tag) {
    event.preventDefault();
    this.filterService.addFilter({
      status: 'TAG',
      questionId: this._tagId,
      questionTitle: tag.label,
      value: tag._id
    });
  }

  get showComment(): boolean {
    return this._showComment;
  }

  get answers() { return this._answers; }
  get readonly(): boolean { return this._readonly; }
  get showComments(): boolean { return this._showComments; }
  get showDetails(): boolean { return this._showDetails; }
  get answersToShow(): Array<Answer> { return this._answersToShow; }
  get answersWithComment(): Array<Answer> { return this._answersWithComment; }
  get stats() { return this._stats; }
  get tags() { return this._tags; }
  get lang(): string { return this._translateService.currentLang; }
}
