/**
 * Created by bastien on 16/11/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { InnovationService } from './../../../../../services/innovation/innovation.service';
import * as _ from 'lodash';

@Component({
  selector: 'market-report-section',
  templateUrl: 'shared-market-report-section.component.html',
  styleUrls: ['shared-market-report-section.component.scss']
})

export class SharedMarketReportSectionComponent implements OnInit {

  private _showDetails: boolean;
  private _maxCountScore: any;
  private _numberFocus: number;
  private _isSaving = false;
  private _chartValues: any;

  @Input() public id: string;
  @Input() public i18n: string;
  @Input() public key: string;
  @Input() public type: string;
  @Input() public innoid: string;
  @Input() public conclusion: string;
  @Input() public answers: any;
  @Input() public prices: number[];
  @Input() public comments: any[];
  @Input() public countries: any;
  @Input() public pieChartData: any;
  @Input() public configuration: any;
  @Input() public priceAverage: number;
  @Input() public scoreAverage: number;
  @Input() public scores: number[];
  @Input() public percentage: number;


  constructor(private _innovationService: InnovationService) { }

  ngOnInit() {
    this._showDetails = false;
    switch(this.type) {
      case 'pie':
        if (this.pieChartData) {
          let data = SharedMarketReportSectionComponent.getChartValues(this.pieChartData);
          this._chartValues = [{
            'data': data || [],
            'backgroundColor': ['#C0210F', '#F2C500', '#82CD30', '#34AC01']
          }];
          this.percentage = this.pieChartData[3].percentage + this.pieChartData[4].percentage;
        }
        break;
      case 'pros':
        this._numberFocus = this.answers.length;
        break;
      case 'score':
        this._numberFocus = this.scoreAverage;
        // Calcul du score max
        this._maxCountScore = _.maxBy(this.scores, 'count')['count'];
        break;
      case 'prices':
        this._numberFocus = this.prices.length + this.comments.length;
        break;
      case 'comments':
        this._numberFocus = this.comments.length;
        break;
      default:
        console.log('Coucou !');
    }
  }

  static getChartValues(stats) {
    return _.map(stats, stat => stat['count']);
  }

  public toggleDetails(){
    this._showDetails = !this._showDetails;
  }

  get showDetails(): boolean {
    return this._showDetails;
  }

  public keyupHandlerFunction(event) {
    this.conclusion = event['content'];
    //Saving
    this._isSaving = true;
    this._innovationService.updateSynthesis(this.innoid, this.conclusion)
      .subscribe(data=>{
        this.conclusion = data.synthesis[this.key];
        //Saved
        this._isSaving = false;
      });
  }

  public getAnswers(commentsList:Array<any>): Array<any> {
    if (this.answers) {
      return _.map(commentsList, comment => _.find(this.answers, (answer: any) => answer.id === comment.answerId));
    } else {
      return [];
    }
  }

  public getFillPerc(value: number): string {
    return `${Math.round(value / this._maxCountScore * 100)}%`;
  }

  public getLevels(lang:string): Array<any> {
    return this.configuration[lang] || [];
  }

  public getFlag(country: string): string {
    return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
  }

  get numberFocus(): number {
    return this._numberFocus;
  }

  get chartValues(): any {
    return this._chartValues;
  }
}
