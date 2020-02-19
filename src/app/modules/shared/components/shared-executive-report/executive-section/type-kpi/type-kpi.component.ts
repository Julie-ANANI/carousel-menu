import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExecutiveSection, SectionKpi} from '../../../../../../models/executive-report';
import {CommonService} from '../../../../../../services/common/common.service';

@Component({
  selector: 'type-kpi',
  templateUrl: './type-kpi.component.html',
  styleUrls: ['./type-kpi.component.scss']
})

export class TypeKpiComponent implements OnInit {

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

    this.content = <SectionKpi>this._section.content;

    this.textColor('title');
    this.textColor('abstract');
    this.textColor('kpi');
    this.textColor('legend');
    this.textColor('examples');

  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  content: SectionKpi = {
    kpi: '',
    legend: '',
    examples: ''
  };

  titleColor = '';

  abstractColor = '';

  kpiColor = '';

  legendColor = '';

  examplesColor = '';

  constructor() { }

  ngOnInit() {
  }

  public emitChanges() {
    this._section.content = this.content;
    this.sectionChange.emit(this._section);
  }

  public textColor(field: string) {
    switch (field) {

      case 'title':
        this.titleColor = CommonService.getLimitColor(this._section.label.length, 26);
        break;

      case 'abstract':
        this.abstractColor = CommonService.getLimitColor(this._section.abstract.length, 175);
        break;

      case 'kpi':
        this.kpiColor = CommonService.getLimitColor(this.content.kpi.length, 4);
        break;

      case 'legend':
        this.legendColor = CommonService.getLimitColor(this.content.legend.length, 82);
        break;

      case 'examples':
        this.examplesColor = CommonService.getLimitColor(this.content.examples.length, 175);
        break;

    }
  }

  get section(): ExecutiveSection {
    return this._section;
  }

}
