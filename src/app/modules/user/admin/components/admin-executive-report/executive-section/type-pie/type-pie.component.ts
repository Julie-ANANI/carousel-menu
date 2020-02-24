import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveSection, SectionPie } from '../../../../../../../models/executive-report';
import { CommonService } from '../../../../../../../services/common/common.service';

@Component({
  selector: 'type-pie',
  templateUrl: './type-pie.component.html',
  styleUrls: ['./type-pie.component.scss']
})

export class TypePieComponent {

  @Input() set section(value: ExecutiveSection) {

    this._section = {
      questionId: value.questionId || '',
      questionType: value.questionType || '',
      abstract: value.abstract || '',
      label: value.label || '',
      content: {
        showPositive: <SectionPie>value.content && (<SectionPie>value.content).showPositive,
        values: [
          {
            value: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[0]
            && (<SectionPie>value.content).values[0].value ? (<SectionPie>value.content).values[0].value : '',
            p_index: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[0]
            && (<SectionPie>value.content).values[0].p_index ? (<SectionPie>value.content).values[0].p_index : '',
            label: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[0]
            && (<SectionPie>value.content).values[0].label ? (<SectionPie>value.content).values[0].label : '',
          },
          {
            value: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[1]
            && (<SectionPie>value.content).values[1].value ? (<SectionPie>value.content).values[1].value : '',
            p_index: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[1]
            && (<SectionPie>value.content).values[1].p_index ? (<SectionPie>value.content).values[1].p_index : '',
            label: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[1]
            && (<SectionPie>value.content).values[1].label ? (<SectionPie>value.content).values[1].label : '',
          },
          {
            value: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[2]
            && (<SectionPie>value.content).values[2].value ? (<SectionPie>value.content).values[2].value : '',
            p_index: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[2]
            && (<SectionPie>value.content).values[2].p_index ? (<SectionPie>value.content).values[2].p_index : '',
            label: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[2]
            && (<SectionPie>value.content).values[2].label ? (<SectionPie>value.content).values[2].label : '',
          },
          {
            value: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[3]
            && (<SectionPie>value.content).values[3].value ? (<SectionPie>value.content).values[3].value : '',
            p_index: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[3]
            && (<SectionPie>value.content).values[3].p_index ? (<SectionPie>value.content).values[3].p_index : '',
            label: <SectionPie>value.content && (<SectionPie>value.content).values && (<SectionPie>value.content).values[3]
            && (<SectionPie>value.content).values[3].label ? (<SectionPie>value.content).values[3].label : '',
          }
        ]
      }
    };

    this._content = <SectionPie>this._section.content;

    this.textColor('title');
    this.textColor('abstract');
    this.textColor('label1');
    this.textColor('label2');
    this.textColor('label3');
    this.textColor('label4');

  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionPie = {
    showPositive: true,
    values: []
  };

  private _titleColor = '';

  private _abstractColor = '';

  private _label1Color = '';

  private _label2Color = '';

  private _label3Color = '';

  private _label4Color = '';

  constructor() { }

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
        this._titleColor = CommonService.getLimitColor(this._section.label.length, 26);
        break;

      case 'abstract':
        this._abstractColor = CommonService.getLimitColor(this._section.abstract.length, 175);
        break;

      case 'label1':
        this._label1Color = CommonService.getLimitColor(this._content.values[0].label.length, 13);
        break;

      case 'label2':
        this._label2Color = CommonService.getLimitColor(this._content.values[1].label.length, 13);
        break;

      case 'label3':
        this._label3Color = CommonService.getLimitColor(this._content.values[2].label.length, 13);
        break;

      case 'label4':
        this._label4Color = CommonService.getLimitColor(this._content.values[3].label.length, 13);
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

  get label1Color(): string {
    return this._label1Color;
  }

  get label2Color(): string {
    return this._label2Color;
  }

  get label3Color(): string {
    return this._label3Color;
  }

  get label4Color(): string {
    return this._label4Color;
  }

}
