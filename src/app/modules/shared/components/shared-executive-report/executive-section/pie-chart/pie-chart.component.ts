import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Question } from '../../../../../../models/question';
import { Answer } from '../../../../../../models/answer';
import { BarData } from '../../../shared-market-report/models/bar-data';
import { ResponseService } from '../../../shared-market-report/services/response.service';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { PieChart } from '../../../../../../models/pie-chart';
import {DataService} from "../../../shared-market-report/services/data.service";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})

export class PieChartComponent implements OnInit {

  @Input() set question(value: Question) {
    this._question = value;
  }

  private _question: Question;

  private _pieChart: PieChart;

  private _barsData: Array<BarData> = [];

  private _colors: Array<{backgroundColor: Array<string>}>;

  private _labels: {[prop: string]: Array<string>};

  private _percentage: number;

  private _labelPercentage: Array<{percentage: Array<string>}>;

  private _datasets: Array<{data: Array<number>}>;

  private _isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _dataService: DataService,
              private _translateService: TranslateService) {

    this._isBrowser = isPlatformBrowser(this.platformId);

  }

  ngOnInit() {
    this._dataService.getAnswers(this._question).subscribe((answers: Array<Answer>) => {
      this._barsData = ResponseService.getBarsData(this._question, answers);

      if (this._question.controlType === 'radio') {
        this._pieChart = ResponseService.getPieChartData(this._barsData, answers);

        if (this._pieChart) {
          this._colors = [{backgroundColor: this._pieChart.colors || []}];
          this._labels = this._pieChart.labels || {};
          this._datasets = [{data: this._pieChart.data || []}];
          this._percentage = this._pieChart.percentage;
          this._labelPercentage = [{percentage: this._pieChart.labelPercentage || []}];
        }

      }
    });
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get pieChart(): PieChart {
    return this._pieChart;
  }

  get colors() {
    return this._colors;
  }

  get labels() {
    return this._labels;
  }

  get percentage() {
    return this._percentage;
  }

  get labelPercentage(): Array<{ percentage: Array<string> }> {
    return this._labelPercentage;
  }

  get datasets() {
    return this._datasets;
  }

  get isBrowser(): boolean {
    return this._isBrowser;
  }

}
