import { Component, Input, OnInit } from '@angular/core';
import { Question } from '../../../../../../models/question';
import { Answer } from '../../../../../../models/answer';
import { BarData } from '../../../shared-market-report/models/bar-data';
import { ResponseService } from '../../../shared-market-report/services/response.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

export class BarChartComponent implements OnInit {

  @Input() set question(value: Question) {
    this._question = value;
  }

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this._loadData();
  }

  private _question: Question;

  private _answers: Array<Answer> = [];

  private _barsData: Array<BarData> = [];

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    this._loadData();
  }

  private _loadData() {
    if (this._question && this._question.identifier && Array.isArray(this._question.options)) {
      this._barsData = ResponseService.getBarsData(this._question, this._answers);
    }
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get question(): Question {
    return this._question;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get barsData(): Array<BarData> {
    return this._barsData;
  }

}
