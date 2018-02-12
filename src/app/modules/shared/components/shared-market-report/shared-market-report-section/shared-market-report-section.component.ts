/**
 * Created by bastien on 16/11/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
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
  private _maxCountScore: any;
  private _isSaving = false;
  private _chartValues: any;
  private _conclusionId: string;
  private _innoid: string;
  private _optionsArray: Array<any>;

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
              private _innovationService: InnovationService,
              private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.innoid = params['innovationId'];
    });
    this.conclusionId = `${this.info.id}Conclusion`;

    switch (this.info.controlType) {
      case 'radio':
        this._chartValues = {
          data: [{
            data: [],
            backgroundColor: []
          }],
          labels: {
            fr: [],
            en: []
          },
          colors: []
        };
        this.info.options.forEach((option: {identifier: string, label: {fr: string, en: string}}) => {
          this._chartValues.data[0].data.push(this.info.pieChart[option.identifier].count);
          this._chartValues.labels.fr.push(option.label.fr);
          this._chartValues.labels.en.push(option.label.en);
          this._chartValues.data[0].backgroundColor.push(this.info.pieChart[option.identifier].color);
        });
        break;
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

  public toggleDetails() {
    this._showDetails = !this._showDetails;
  }

  public keyupHandlerFunction(event: any) {
    // Saving
    this._isSaving = true;
    const savedObject = {};
    savedObject[this.info.id] = {
      conclusion: event['content']
    };
    this._innovationService.updateSynthesis(this.innoid, savedObject)
      .first()
      .subscribe(data => {
        if (this.info.id === 'professionals') {
          this.info.conclusion = data.infographics.professionals.conclusion;
        } else {
          const questionIndex = _.findIndex(data.infographics.questions, (q: any) => q.id === this.info.id);
          if (questionIndex > -1) {
            this.info.conclusion = data.infographics.questions[questionIndex].conclusion;
          }
        }
        // Saved
        this._isSaving = false;
      });
  }

  public getAnswers(commentsList: Array<any>): Array<any> {
    if (this.answers) {
      const answers = _.map(commentsList, comment => _.find(this.answers, (answer: any) => answer.id === comment.answerId));
      return _.filter(answers, a => a);
    } else {
      return [];
    }
  }

  public getFillPerc(value: number): string {
    return `${Math.round(value / this._maxCountScore * 100)}%`;
  }

  public getFlag(country: any): string {
    if (country && country.flag) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country.flag}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }

  get readonly(): boolean { return this._readonly; }
  get showDetails(): boolean { return this._showDetails; }
  get innoid(): string { return this._innoid; }
  set innoid(value: string) { this._innoid = value; }
  get chartValues(): any { return this._chartValues; }
  set conclusionId(value: string) { this._conclusionId = value; }
  get conclusionId(): string { return this._conclusionId; }
  get lang(): any { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
