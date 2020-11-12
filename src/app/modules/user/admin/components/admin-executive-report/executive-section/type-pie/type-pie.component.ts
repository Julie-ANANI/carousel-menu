import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveSection, SectionPie } from '../../../../../../../models/executive-report';
import { CommonService } from '../../../../../../../services/common/common.service';
import { ExecutivePieChart } from '../../../../../../../models/pie-chart';

@Component({
  selector: 'app-admin-section-type-pie',
  templateUrl: './type-pie.component.html',
  styleUrls: ['./type-pie.component.scss']
})

export class TypePieComponent {

  @Input() isEditable = false;

  @Input() set section(value: ExecutiveSection) {
    this._section = value;
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

  @Output() playSection: EventEmitter<void> = new EventEmitter<void>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionPie = {
    favorable_answers: {
      percentage: 0,
      visibility: false
    },
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

  private _setPieChartData() {
    if (this._content && this._content.values) {
      this._content.values.forEach((value, index) => {
        this._pieChart.data[index] = value.percentage;
        this._pieChart.colors[index] = value.color;
        this._pieChart.labels[index] = value.legend;
        this._pieChart.labelPercentage[index] = value.percentage;
      });
    }
  }

  public emitChanges() {
    if (this.isEditable) {
      this._section.content = this._content;
      this.sectionChange.emit(this._section);
    }
  }

  public toggleResponses() {
    this._content.favorable_answers.visibility = !this._content.favorable_answers.visibility;
    this.emitChanges();
  }

  public textColor(field: string) {
    switch (field) {

      case 'title':
        this._titleColor = CommonService.getLimitColor(this._section.title, 26);
        break;

      case 'abstract':
        this._abstractColor = CommonService.getLimitColor(this._section.abstract, 175);
        break;

      case 'legend1':
        this._legend1Color = CommonService.getLimitColor(this._content.values[0] && this._content.values[0].legend, 13);
        break;

      case 'legend2':
        this._legend2Color = CommonService.getLimitColor(this._content.values[1] && this._content.values[1].legend, 13);
        break;

      case 'legend3':
        this._legend3Color = CommonService.getLimitColor(this._content.values[2] && this._content.values[2].legend, 13);
        break;

      case 'legend4':
        this._legend4Color = CommonService.getLimitColor(this._content.values[3] && this._content.values[3].legend, 13);
        break;

    }
  }

  public onClickPlay(event: Event) {
    event.preventDefault();
    this.playSection.emit();
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
