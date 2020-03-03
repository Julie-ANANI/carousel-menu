import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveSection, SectionPie } from '../../../../../../../models/executive-report';
import { CommonService } from '../../../../../../../services/common/common.service';
import { ExecutivePieChart } from '../../../../../../../models/pie-chart';

@Component({
  selector: 'type-pie',
  templateUrl: './type-pie.component.html',
  styleUrls: ['./type-pie.component.scss']
})

export class TypePieComponent {

  @Input() set section(value: ExecutiveSection) {

    this._setSectionData(value);
    this._content = <SectionPie>this._section.content;
    this._setPieChartData();

    this.textColor('title');
    this.textColor('abstract');
    this.textColor('legend1');
    this.textColor('legend2');
    this.textColor('legend3');
    this.textColor('legend4');

  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionPie = {
    showPositive: true,
    favorable: '',
    values: []
  };

  private _titleColor = '';

  private _abstractColor = '';

  private _legend1Color = '';

  private _legend2Color = '';

  private _legend3Color = '';

  private _legend4Color = '';

  private _pieChart: ExecutivePieChart = {
    data: [],
    colors: [],
    labels: [],
    labelPercentage: []
  };

  constructor() { }

  private _setSectionData(value: ExecutiveSection) {
    this._section = {
      questionId: value.questionId || '',
      questionType: value.questionType || '',
      abstract: value.abstract || '',
      title: value.title || '',
      content: {
        showPositive: <SectionPie>value.content && (<SectionPie>value.content).showPositive,
        favorable: <SectionPie>value.content && (<SectionPie>value.content).favorable || '',
        values: [
          {
            percentage: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[0]
              && (<SectionPie>value.content).values[0].percentage,
            answers: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[0]
              && (<SectionPie>value.content).values[0].answers,
            legend: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[0]
              && (<SectionPie>value.content).values[0].legend || '',
            color: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[0]
              && (<SectionPie>value.content).values[0].color || '',
          },
          {
            percentage: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[1]
              && (<SectionPie>value.content).values[1].percentage,
            answers: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[1]
              && (<SectionPie>value.content).values[1].answers,
            legend: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[1]
              && (<SectionPie>value.content).values[1].legend || '',
            color: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[1]
              && (<SectionPie>value.content).values[1].color || '',
          },
          {
            percentage: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[2]
              && (<SectionPie>value.content).values[2].percentage,
            answers: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[2]
              && (<SectionPie>value.content).values[2].answers,
            legend: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[2]
              && (<SectionPie>value.content).values[2].legend || '',
            color: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[2]
              && (<SectionPie>value.content).values[2].color || '',
          },
          {
            percentage: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[3]
              && (<SectionPie>value.content).values[3].percentage,
            answers: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[3]
              && (<SectionPie>value.content).values[3].answers,
            legend: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[3]
              && (<SectionPie>value.content).values[3].legend || '',
            color: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[3]
              && (<SectionPie>value.content).values[3].color || '',
          }
        ]
      }
    };
  }

  private _setPieChartData() {
    if (this._content && this._content.values) {
      this._content.values.forEach((value, index) => {
        this._pieChart.data[index] = value.answers;
        this._pieChart.colors[index] = value.color;
        this._pieChart.labels[index] = value.legend;
        this._pieChart.labelPercentage[index] = value.percentage;
      });
    }
  }

  public emitChanges() {
    this._section.content = this._content;
    this.sectionChange.emit(this._section);
  }

  public toggleResponses() {
    this._content.showPositive = !this._content.showPositive;
    this.emitChanges();
  }

  public textColor(field: string) {
    switch (field) {

      case 'title':
        this._titleColor = CommonService.getLimitColor(this._section.title.length, 26);
        break;

      case 'abstract':
        this._abstractColor = CommonService.getLimitColor(this._section.abstract.length, 175);
        break;

      case 'legend1':
        this._legend1Color = CommonService.getLimitColor(this._content.values[0].legend.length, 13);
        break;

      case 'legend2':
        this._legend2Color = CommonService.getLimitColor(this._content.values[1].legend.length, 13);
        break;

      case 'legend3':
        this._legend3Color = CommonService.getLimitColor(this._content.values[2].legend.length, 13);
        break;

      case 'legend4':
        this._legend4Color = CommonService.getLimitColor(this._content.values[3].legend.length, 13);
        break;

    }
  }

  get section(): ExecutiveSection {
    return this._section;
  }

  get titleColor(): string {
    return this._titleColor;
  }

  get abstractColor(): string {
    return this._abstractColor;
  }

  get content(): SectionPie {
    return this._content;
  }

  get legend1Color(): string {
    return this._legend1Color;
  }

  get legend2Color(): string {
    return this._legend2Color;
  }

  get legend3Color(): string {
    return this._legend3Color;
  }

  get legend4Color(): string {
    return this._legend4Color;
  }

  get pieChart(): ExecutivePieChart {
    return this._pieChart;
  }

}
