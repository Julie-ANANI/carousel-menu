import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveSection, SectionBar } from '../../../../../../../models/executive-report';
import { CommonService } from '../../../../../../../services/common/common.service';

@Component({
  selector: 'type-bar',
  templateUrl: './type-bar.component.html',
  styleUrls: ['./type-bar.component.scss']
})

export class TypeBarComponent {

  @Input() set section(value: ExecutiveSection) {

    this._section = {
      questionId: value.questionId || '',
      questionType: value.questionType || '',
      abstract: value.abstract || '',
      label: value.label || '',
      content: {
        showExamples: <SectionBar>value.content && (<SectionBar>value.content).showExamples,
        values: [
          {
            legend: <SectionBar>value.content && (<SectionBar>value.content).values && (<SectionBar>value.content).values[0]
              && (<SectionBar>value.content).values[0].legend ? (<SectionBar>value.content).values[0].legend : '',
            example: <SectionBar>value.content && (<SectionBar>value.content).values && (<SectionBar>value.content).values[0]
            && (<SectionBar>value.content).values[0].example ? (<SectionBar>value.content).values[0].example : '',
            value: <SectionBar>value.content && (<SectionBar>value.content).values && (<SectionBar>value.content).values[0]
            && (<SectionBar>value.content).values[0].value ? (<SectionBar>value.content).values[0].value : '',
          },
          {
            legend: <SectionBar>value.content && (<SectionBar>value.content).values && (<SectionBar>value.content).values[1]
            && (<SectionBar>value.content).values[1].legend ? (<SectionBar>value.content).values[1].legend : '',
            example: <SectionBar>value.content && (<SectionBar>value.content).values && (<SectionBar>value.content).values[1]
            && (<SectionBar>value.content).values[1].example ? (<SectionBar>value.content).values[1].example : '',
            value: <SectionBar>value.content && (<SectionBar>value.content).values && (<SectionBar>value.content).values[1]
            && (<SectionBar>value.content).values[1].value ? (<SectionBar>value.content).values[1].value : '',
          },
          {
            legend: <SectionBar>value.content && (<SectionBar>value.content).values && (<SectionBar>value.content).values[2]
            && (<SectionBar>value.content).values[2].legend ? (<SectionBar>value.content).values[2].legend : '',
            example: <SectionBar>value.content && (<SectionBar>value.content).values && (<SectionBar>value.content).values[2]
            && (<SectionBar>value.content).values[2].example ? (<SectionBar>value.content).values[2].example : '',
            value: <SectionBar>value.content && (<SectionBar>value.content).values && (<SectionBar>value.content).values[2]
            && (<SectionBar>value.content).values[2].value ? (<SectionBar>value.content).values[2].value : '',
          }
        ]
      }
    };

    this._content = <SectionBar>this._section.content;

    this.textColor('title');
    this.textColor('abstract');
    this.textColor('legend', 1);
    this.textColor('legend', 2);
    this.textColor('legend', 3);
    this.textColor('example', 1);
    this.textColor('example', 2);
    this.textColor('example', 3);

  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionBar = {
    showExamples: true,
    values: []
  };

  private _titleColor = '';

  private _abstractColor = '';

  private _legend1Color = '';

  private _legend2Color = '';

  private _legend3Color = '';

  private _example1Color = '';

  private _example2Color = '';

  private _example3Color = '';

  constructor() { }

  public emitChanges() {
    this._section.content = this._content;
    this.sectionChange.emit(this._section);
  }

  public toggleExamples() {
    this._content.showExamples = !this._content.showExamples;
    this.emitChanges();
  }

  public textColor(field: string, index?: number) {
    switch (field) {

      case 'title':
        this._titleColor = CommonService.getLimitColor(this._section.label.length, 26);
        break;

      case 'abstract':
        this._abstractColor = CommonService.getLimitColor(this._section.abstract.length, 175);
        break;

      case 'legend':
        if (index === 1) {
          this._legend1Color = CommonService.getLimitColor(this._content.values[0].legend.length, 32);
        } else if (index === 2) {
          this._legend2Color = CommonService.getLimitColor(this._content.values[1].legend.length, 32);
        } else if (index === 3) {
          this._legend3Color = CommonService.getLimitColor(this._content.values[2].legend.length, 32);
        }
        break;

      case 'example':
        if (index === 1) {
          this._example1Color = CommonService.getLimitColor(this._content.values[0].example.length, 40);
        } else if (index === 2) {
          this._example2Color = CommonService.getLimitColor(this._content.values[1].example.length, 40);
        } else if (index === 3) {
          this._example3Color = CommonService.getLimitColor(this._content.values[2].example.length, 40);
        }
        break;

    }
  }

  get section(): ExecutiveSection {
    return this._section;
  }

  get content(): SectionBar {
    return this._content;
  }

  get titleColor(): string {
    return this._titleColor;
  }

  get abstractColor(): string {
    return this._abstractColor;
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

  get example1Color(): string {
    return this._example1Color;
  }

  get example2Color(): string {
    return this._example2Color;
  }

  get example3Color(): string {
    return this._example3Color;
  }

}
