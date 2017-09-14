import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-infographic-answers-qcm',
  templateUrl: './shared-infographic-answers-qcm.component.html',
  styleUrls: ['./shared-infographic-answers-qcm.component.styl']
})
export class SharedInfographicAnswersQcmComponent implements OnInit {

  @Input() public title: string;
  @Input() public answers: string;
  @Input() public propositions: any;

  private _data: any[];

  private _barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
  };


  constructor() { }

  ngOnInit() {
    this._data = this.calculStats();
  }

  get data (): any {
    return this._data;
  }
  set data (data: any) {
    this._data = data;
  }

  get barChartOptions() {
    return this._barChartOptions;
  }

  private calculStats(): any {
    const data: any = [];
    for (const proposition of this.propositions) {

      let cpt = 0;
      for (const answer of this.answers) {
        if (answer === proposition) {
          cpt++;
        }
      }
      data.push({
        data: [Math.floor(cpt * 100 / this.answers.length)],
        label: proposition
      });

    }
    return data;
  }

  getQuantityPerProp() {
    const datas: any = [];
    for (const proposition of this.propositions) {

      let cpt = 0;
      for (const answer of this.answers) {
        if (answer === proposition) {
          cpt++;
        }
      }
      datas.push(Math.floor(cpt * 100 / this.answers.length));

    }
    return datas;
  }

}
