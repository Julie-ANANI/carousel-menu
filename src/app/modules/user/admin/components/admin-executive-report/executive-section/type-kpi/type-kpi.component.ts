import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveSection, SectionKpi } from '../../../../../../../models/executive-report';
import { CommonService } from '../../../../../../../services/common/common.service';

@Component({
  selector: 'type-kpi',
  templateUrl: './type-kpi.component.html',
  styleUrls: ['./type-kpi.component.scss']
})

export class TypeKpiComponent {

  @Input() set section(value: ExecutiveSection) {

    this._section = {
      questionId: value.questionId || '',
      questionType: value.questionType || '',
      abstract: value.abstract || '',
      label: value.label || '',
      content: {
        kpi: <SectionKpi>value.content && (<SectionKpi>value.content).kpi ? (<SectionKpi>value.content).kpi : '',
        legend: <SectionKpi>value.content && (<SectionKpi>value.content).legend ? (<SectionKpi>value.content).legend : '',
        examples: <SectionKpi>value.content && (<SectionKpi>value.content).examples ? (<SectionKpi>value.content).examples : ''
      }
    };

    this._content = <SectionKpi>this._section.content;

    this.textColor('title');
    this.textColor('abstract');
    this.textColor('kpi');
    this.textColor('legend');
    this.textColor('examples');

  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionKpi = {
    kpi: '',
    legend: '',
    examples: ''
  };

  private _titleColor = '';

  private _abstractColor = '';

  private _kpiColor = '';

  private _legendColor = '';

  private _examplesColor = '';

  constructor() { }

  public emitChanges() {
    this._section.content = this._content;
    this.sectionChange.emit(this._section);
  }

  public textColor(field: string) {
    switch (field) {

      case 'title':
        this._titleColor = CommonService.getLimitColor(this._section.label.length, 26);
        break;

      case 'abstract':
        this._abstractColor = CommonService.getLimitColor(this._section.abstract.length, 175);
        break;

      case 'kpi':
        this._kpiColor = CommonService.getLimitColor(this._content.kpi.length, 4);
        break;

      case 'legend':
        this._legendColor = CommonService.getLimitColor(this._content.legend.length, 82);
        break;

      case 'examples':
        this._examplesColor = CommonService.getLimitColor(this._content.examples.length, 175);
        break;

    }
  }

  get section(): ExecutiveSection {
    return this._section;
  }

  get content(): SectionKpi {
    return this._content;
  }

  get titleColor(): string {
    return this._titleColor;
  }

  get abstractColor(): string {
    return this._abstractColor;
  }

  get kpiColor(): string {
    return this._kpiColor;
  }

  get legendColor(): string {
    return this._legendColor;
  }

  get examplesColor(): string {
    return this._examplesColor;
  }

}
