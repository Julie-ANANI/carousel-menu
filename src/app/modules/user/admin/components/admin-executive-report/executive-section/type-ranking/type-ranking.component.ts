import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveSection, SectionRanking } from '../../../../../../../models/executive-report';
import { CommonService } from '../../../../../../../services/common/common.service';

@Component({
  selector: 'type-ranking',
  templateUrl: './type-ranking.component.html',
  styleUrls: ['./type-ranking.component.scss']
})

export class TypeRankingComponent {

  @Input() set section(value: ExecutiveSection) {

    this._section = {
      questionId: value.questionId || '',
      questionType: value.questionType || '',
      abstract: value.abstract || '',
      label: value.label || '',
      content: {
        values: [
          {
            legend: <SectionRanking>value.content && (<SectionRanking>value.content).values && (<SectionRanking>value.content).values[0]
            && (<SectionRanking>value.content).values[0].legend ? (<SectionRanking>value.content).values[0].legend : '',
            color: <SectionRanking>value.content && (<SectionRanking>value.content).values && (<SectionRanking>value.content).values[0]
            && (<SectionRanking>value.content).values[0].color ? (<SectionRanking>value.content).values[0].color : '',
            value: <SectionRanking>value.content && (<SectionRanking>value.content).values && (<SectionRanking>value.content).values[0]
            && (<SectionRanking>value.content).values[0].value ? (<SectionRanking>value.content).values[0].value : '',
          },
          {
            legend: <SectionRanking>value.content && (<SectionRanking>value.content).values && (<SectionRanking>value.content).values[1]
            && (<SectionRanking>value.content).values[1].legend ? (<SectionRanking>value.content).values[1].legend : '',
            color: <SectionRanking>value.content && (<SectionRanking>value.content).values && (<SectionRanking>value.content).values[1]
            && (<SectionRanking>value.content).values[1].color ? (<SectionRanking>value.content).values[1].color : '',
            value: <SectionRanking>value.content && (<SectionRanking>value.content).values && (<SectionRanking>value.content).values[1]
            && (<SectionRanking>value.content).values[1].value ? (<SectionRanking>value.content).values[1].value : '',
          },
          {
            legend: <SectionRanking>value.content && (<SectionRanking>value.content).values && (<SectionRanking>value.content).values[2]
            && (<SectionRanking>value.content).values[2].legend ? (<SectionRanking>value.content).values[2].legend : '',
            color: <SectionRanking>value.content && (<SectionRanking>value.content).values && (<SectionRanking>value.content).values[2]
            && (<SectionRanking>value.content).values[2].color ? (<SectionRanking>value.content).values[2].color : '',
            value: <SectionRanking>value.content && (<SectionRanking>value.content).values && (<SectionRanking>value.content).values[2]
            && (<SectionRanking>value.content).values[2].value ? (<SectionRanking>value.content).values[2].value : '',
          }
        ]
      }
    };

    this._content = <SectionRanking>this._section.content;

    this.textColor('title');
    this.textColor('abstract');
    this.textColor('legend', 1);
    this.textColor('legend', 2);
    this.textColor('legend', 3);
    this.textColor('element', 1);
    this.textColor('element', 2);
    this.textColor('element', 3);

  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionRanking = {
    values: []
  };

  private _titleColor = '';

  private _abstractColor = '';

  private _legend1Color = '';

  private _legend2Color = '';

  private _legend3Color = '';

  private _element1Color = '';

  private _element2Color = '';

  private _element3Color = '';

  constructor() { }

  public emitChanges() {
    this._section.content = this._content;
    this.sectionChange.emit(this._section);
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
          this._legend1Color = CommonService.getLimitColor(this._content.values[0].value.length, 13);
        } else if (index === 2) {
          this._legend2Color = CommonService.getLimitColor(this._content.values[1].value.length, 13);
        } else if (index === 3) {
          this._legend3Color = CommonService.getLimitColor(this._content.values[2].value.length, 13);
        }
        break;

      case 'element':
        if (index === 1) {
          this._element1Color = CommonService.getLimitColor(this._content.values[0].legend.length, 20);
        } else if (index === 2) {
          this._element2Color = CommonService.getLimitColor(this._content.values[1].legend.length, 20);
        } else if (index === 3) {
          this._element3Color = CommonService.getLimitColor(this._content.values[2].legend.length, 20);
        }
        break;

    }
  }

  public setColor(value: string, index: number) {
    this._content.values[index].color = value;
    this.emitChanges();
  }

  get section(): ExecutiveSection {
    return this._section;
  }

  get content(): SectionRanking {
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

  get element1Color(): string {
    return this._element1Color;
  }

  get element2Color(): string {
    return this._element2Color;
  }

  get element3Color(): string {
    return this._element3Color;
  }

}
