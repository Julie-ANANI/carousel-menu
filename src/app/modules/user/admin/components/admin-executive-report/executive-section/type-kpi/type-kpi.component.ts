import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveSection, SectionKpi } from '../../../../../../../models/executive-report';
import { CommonService } from '../../../../../../../services/common/common.service';

@Component({
  selector: 'app-admin-section-type-kpi',
  templateUrl: './type-kpi.component.html',
  styleUrls: ['./type-kpi.component.scss']
})

export class TypeKpiComponent {

  @Input() isEditable = false;

  @Input() set section(value: ExecutiveSection) {
    this._section = value;
    this._content = <SectionKpi>this._section.content;
    this.textColor('title');
    this.textColor('abstract');
    this.textColor('kpi');
    this.textColor('legend');
    this.textColor('examples');
  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  @Output() playSection: EventEmitter<void> = new EventEmitter<void>();

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
    if (this.isEditable) {
      this._section.content = this._content;
      this.sectionChange.emit(this._section);
    }
  }

  public textColor(field: string) {
    switch (field) {

      case 'title':
        this._titleColor = CommonService.getLimitColor(this._section.title, 40);
        break;

      case 'abstract':
        this._abstractColor = CommonService.getLimitColor(this._section.abstract, 175);
        break;

      case 'kpi':
        this._kpiColor = CommonService.getLimitColor(this._content.kpi, 4);
        break;

      case 'legend':
        this._legendColor = CommonService.getLimitColor(this._content.legend, 82);
        break;

      case 'examples':
        this._examplesColor = CommonService.getLimitColor(this._content.examples, 175);
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
