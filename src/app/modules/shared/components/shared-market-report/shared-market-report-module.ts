/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import * as _ from 'lodash';


import { InnovationService } from './../../../../services/innovation/innovation.service';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss', './shared-market-report.component-popover.scss']
})

export class SharedMarketReportComponent implements OnInit {

  private _selectLangInput = 'en';
  private _detailsExpanded: boolean;
  private _chartPieData: any;
  private _modalActive: string = '';
  private _isSaving = false;

  private _infographics: any;
  private _conclusions: any;
  private _showDetails: any;
  private _maxCountScore: number;

  private _configurations = {
    'relevantProblematic':{
      'fr': ['Non', 'Eventuellement', 'Oui', 'Cruciale'],
      'en': ['Non-existent', 'Possibly', 'Frequently', 'Critical']
    },
    'productAnsweringProblematic': {
      'en': ['No', 'Possibly', 'Likely', 'Yes'],
      'fr': ['Non', 'Partiellement', 'Bien', 'Très bien']
    },
    'productInterests': {
      'en': ['No – less relevant', 'Equivalent', 'Yes – A few advantages', 'Absolutely'],
      'fr': ['Non', 'Peut-être', 'Oui', 'Indiscutablement']
    },
    'interestOfProfessionals': {
      'en': ['They want to be a customer', 'They wish to participate in the development', 'They want to distribute the solution'],
      'fr': ['Ils souhaitent être client', 'Ils souhaitent participer au développement', 'Ils souhaitent distribuer la solution']
    }
  };

  public readonly: boolean;

  private innoid = '599c0029719e572041aafe0d';

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      const innovationId = params['innovationId'] || this.innoid;
      this.readonly = true;
      this._route
        .queryParams
        .subscribe(params => {
          this.readonly = !(params['isAdmin'] &&  params['isAdmin'] === 'true' );
        });
      this._detailsExpanded = false;
      this._selectLangInput = this._translateService.currentLang || this._translateService.getBrowserLang() || 'fr';
      this._innovationService.getInnovationSythesis(innovationId).subscribe(synthesis => {
        this._infographics = synthesis.infographics;
        this._conclusions = synthesis.conclusions || {};
        // Calcul du score max
        this._maxCountScore = _.max(_.map(this._infographics.scores, score => score['count']));
        // Calculate the piecharts
        if(this._infographics.pieCharts) {
          this._chartPieData = {
            'productAnsweringProblematic': SharedMarketReportComponent.getChartValues(this._infographics.pieCharts.productAnsweringProblematic),
            'relevantProblematic': SharedMarketReportComponent.getChartValues(this._infographics.pieCharts.relevantProblematic),
            'productInterests': SharedMarketReportComponent.getChartValues(this._infographics.pieCharts.productInterests)
          };
        }

      });
      this._showDetails = { // TODO change to the right default (open or closed)
        'professionals': true,
        'relevantProblematic': true,
        'productAnsweringProblematic': true,
        'productInterests': true,
        'interestOfProfessionals': true,
        'partners': true,
        'competitors': true,
        'prices': true,
        'commentsPositive': true,
        'commentsNegative': true,
        'applications': true
      }
    });
  }

  static getChartValues(stats) {
    return _.map(stats, stat => stat['count']);
  }

  public toggleSections(){
    let self = this;
    _.forEach(this._showDetails, (detail, key) => {
      self[key] = !detail;
    });
  }

  public getAnswers(answersList:Array<any>): Array<any> {
    if (this._infographics && this._infographics.answers) {
      let answers = this._infographics.answers;
      return _.map(answersList, answer => _.find(answers, '_id', answer.answerId));
    } else {
      return [];
    }
  }

  public getCommentPro(comment:any): Array<any> {
    if (this._infographics && this._infographics.answers) {
      let answers = this._infographics.answers;
      return [_.find(answers, '_id', comment.answerId)];
    } else {
      return [];
    }
  }

  public getPiechartData(section: string): any {
    let data = [
      {'data': this._chartPieData[section] || [],'backgroundColor': ['#C0210F', '#F2C500', '#82CD30', '#34AC01']}
    ];
    return data;
  }

  public getFillPerc(value: number): string {
    return `${Math.round(value / this._maxCountScore * 100)}%`;
  }

  public getLevels(section:string, lang:string): Array<any> {
    return this._configurations[section][lang] || [];
  }

  public seeAnswer(answer: any) { //TODO modal
    console.log('OKAY');
    this._modalActive = 'active';
  }

  public keyupHandlerFunction(event) {
    this._conclusions[event['id']] = event['content'];
    //Saving
    this._isSaving = true;
    this._innovationService.updateSynthesis(this.innoid, this._conclusions)
      .subscribe(data=>{
        this._conclusions= data.synthesis;
        //Saved
        this._isSaving = false;
      });
  }

  get active(): string {
    return this._modalActive;
  }

  public getFlag(country: string): string {
    return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
  }

  public showDetails(param: string): boolean {
    return !!this._showDetails[param];
  }

  public toggleDetails(param: string) {
    this._showDetails[param] = !this._showDetails[param];
  }

  public canShow(): boolean {
    return !!this._infographics;
}

  get infographics(): any {
    return this._infographics;
  }

  get conclusions(): any {
    return this._conclusions;
  }

  get detailsExpanded(): boolean {
    return this._detailsExpanded;
  }

  set detailsExpanded(value: boolean) {
    this._detailsExpanded = value;
  }


};
