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
  private _maxCountScore: number;
  private _percentage: number;
  private _isSaving = false;
  private _chartValues: any;

  @Input() public id: string;
  @Input() public i18n: string;
  @Input() public key: string;
  @Input() public type: string;
  @Input() public innoid: string;
  @Input() public conclusion: string;
  @Input() public pieChartData: any;
  @Input() public configuration: any;
  @Input() public maxCountScore: number;


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
          this._percentage = this.pieChartData[3].percentage + this.pieChartData[4].percentage;
        }
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

  public getFillPerc(value: number): string {
    return `${Math.round(value / this._maxCountScore * 100)}%`;
  }

  public getLevels(lang:string): Array<any> {
    return this.configuration[lang] || [];
  }

  public getFlag(country: string): string {
    return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
  }

  get percentage(): number {
    return this._percentage;
  }

  get chartValues(): any {
    return this._chartValues;
  }
}
