/**
 * Created by bastien on 16/11/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { InnovationService } from './../../../../../services/innovation/innovation.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'market-report-section',
  templateUrl: 'shared-market-report-section.component.html',
  styleUrls: ['shared-market-report-section.component.scss']
})

export class SharedMarketReportSectionComponent implements OnInit {

  private _showDetails: boolean;
  public readonly: boolean;
  private _maxCountScore: any;
  private _isSaving = false;
  private _chartValues: any;

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

  @Input() public id: string;
  @Input() public i18n: string;
  @Input() public type: string;
  @Input() public innoid: string;
  @Input() public answers: any;
  @Input() public info: any;


  constructor(private _innovationService: InnovationService,
              private _route: ActivatedRoute) { }

  ngOnInit() {
    this._showDetails = false;
    this.readonly = true;
    this._route
      .queryParams
      .subscribe(params => {
        this.readonly = !(params['isAdmin'] &&  params['isAdmin'] === 'true' );
      });
    switch(this.type) {
      case 'pie':
        if (this.info.pieChart) {
          let data = SharedMarketReportSectionComponent.getChartValues(this.info.pieChart);
          this._chartValues = [{
            'data': data || [],
            'backgroundColor': ['#C0210F', '#F2C500', '#82CD30', '#34AC01']
          }];
        }
        break;
      case 'score':
        // Calcul du score max
        this._maxCountScore = _.maxBy(this.info.data, 'count')['count'];
        break;
    }
  }

  static getChartValues(stats) {
    return _.map(stats, s => s['count']);
  }

  public toggleDetails(){
    this._showDetails = !this._showDetails;
  }

  get showDetails(): boolean {
    return this._showDetails;
  }

  public keyupHandlerFunction(event) {
    //Saving
    this._isSaving = true;
    const savedObject = {};
    savedObject[this.id]['conclusion'] = event['content'];
    this._innovationService.updateSynthesis(this.innoid, savedObject)
      .subscribe(data => {
        this.info.conclusion = data.infographics[this.id]['conclusion'];
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

  public getLevels(lang:string): Array<any> {
    return this.configurations[this.id][lang] || [];
  }

  public getFlag(country: string): string {
    return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
  }

  get configurations(): any {
    return this._configurations;
  }

  get chartValues(): any {
    return this._chartValues;
  }
}
