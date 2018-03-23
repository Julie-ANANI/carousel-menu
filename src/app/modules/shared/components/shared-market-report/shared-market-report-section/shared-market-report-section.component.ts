/**
 * Created by bastien on 16/11/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../models/answer';
import * as _ from 'lodash';

@Component({
  selector: 'market-report-section',
  templateUrl: 'shared-market-report-section.component.html',
  styleUrls: ['shared-market-report-section.component.scss']
})

export class SharedMarketReportSectionComponent implements OnInit {

  private _showDetails: boolean;
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
  @Input() public answers: Answer;
  @Input() public info: any;


  constructor(private _translateService: TranslateService,
              private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this._innoid = params['projectId'];
    });

    switch (this.info.controlType) {
      case 'scale':
        // Calcul du score max
        const max = _.maxBy(this.info.data, 'count') || {};
        this._maxCountScore = max['count'] || 0;
        break;
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
  get showDetails(): boolean { return this._showDetails; }
  get innoid(): string { return this._innoid; }
  set innoid(value: string) { this._innoid = value; }
  get lang(): any { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
