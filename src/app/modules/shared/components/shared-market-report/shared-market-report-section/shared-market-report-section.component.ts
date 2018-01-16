/**
 * Created by bastien on 16/11/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InnovationService } from './../../../../../services/innovation/innovation.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
  private _advantages: string[];

  @Input() set showDetails(value: boolean) {
    this._showDetails = value;
  }
  @Input() set readonly(value: boolean) {
    this._readonly = value;
  }
  @Output() modalAnswerChange = new EventEmitter<any>();
  @Input() public answers: any;
  @Input() public info: any;


  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.innoid = params['innovationId'];
    });
    this.conclusionId = `${this.info.id}Conclusion`;

    if (this.info.pieChart) {
      let data = SharedMarketReportSectionComponent.getChartValues(this.info.pieChart);
      this._chartValues = [{
        'data': data || [],
        'backgroundColor': ['#C0210F', '#F2C500', '#82CD30', '#34AC01']
      }];
    }

    switch(this.info.controlType) {
      case 'stars':
        this._innovationService.getInnovationCardByLanguage(this.innoid, this.lang).subscribe(card => {
          this._advantages = card.advantages;
        });
        break;
      case 'scale':
        // Calcul du score max
        const max = _.maxBy(this.info.data, 'count') || {};
        this._maxCountScore = max['count'] || 0;
        break;
    }
  }

  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

  static getChartValues(stats) {
    return _.map(stats, s => s['count']);
  }

  public toggleDetails(){
    this._showDetails = !this._showDetails;
  }

  public keyupHandlerFunction(event) {
    //Saving
    this._isSaving = true;
    const savedObject = {};
    savedObject[this.info.id] = {
      conclusion: event['content']
    };
    console.log(savedObject);
    this._innovationService.updateSynthesis(this.innoid, savedObject)
      .subscribe(data => {
        if (this.info.id === 'professionals') {
          this.info.conclusion = data.infographics.professionals.conclusion;
        } else {
          const questionIndex = _.findIndex(data.infographics.questions, (q: any) => q.id === this.info.id);
          if (questionIndex > -1) this.info.conclusion = data.infographics.questions[questionIndex].conclusion;
        }
        //Saved
        this._isSaving = false;
      });
  }

  public getAnswers(commentsList:Array<any>): Array<any> {
    if (this.answers) {
      let answers = _.map(commentsList, comment => _.find(this.answers, (answer: any) => answer.id === comment.answerId));
      return _.filter(answers, a => a);
    } else {
      return [];
    }
  }

  public getFillPerc(value: number): string {
    return `${Math.round(value / this._maxCountScore * 100)}%`;
  }

  public getFlag(country: string): string {
    return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
  }

  get advantages(): string[] { return this._advantages; }
  get readonly(): boolean { return this._readonly; }
  get showDetails(): boolean { return this._showDetails; }
  get innoid(): string { return this._innoid; }
  set innoid(value: string) { this._innoid = value; }
  get chartValues(): any { return this._chartValues; }
  set conclusionId(value: string) { this._conclusionId = value; }
  get conclusionId(): string { return this._conclusionId; }
  get lang(): any { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
