import { Component, Input, OnInit } from '@angular/core';
import { Question } from '../../../../../../models/question';
import { Answer } from '../../../../../../models/answer';
import { ResponseService } from '../../../shared-market-report/services/response.service';
import { PieChart } from '../../../../../../models/pie-chart';
import { DataService } from '../../../shared-market-report/services/data.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html'
})

export class PieChartComponent implements OnInit {

  @Input() set question(value: Question) {
    this._question = value;
  }

  private _question: Question;

  private _pieChart: PieChart;


  constructor(private _dataService: DataService) {}

  ngOnInit() {
    /* Update data when we first get answers */
    this._dataService.getAnswers(this._question).subscribe((answers: Array<Answer>) => {
      const barsData = ResponseService.barsData(this._question, answers);
      this._pieChart = ResponseService.pieChartData(barsData, answers);
    });
  }


  get pieChart(): PieChart {
    return this._pieChart;
  }


}
