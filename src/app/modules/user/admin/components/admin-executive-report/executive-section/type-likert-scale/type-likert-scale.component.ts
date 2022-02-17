import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ExecutiveSection,
  SectionLikertScale
} from '../../../../../../../models/executive-report';
import {CommonService} from '../../../../../../../services/common/common.service';
import colorsAndNames from '../../../../../../../../../assets/json/likert-scale_executive-report.json';

@Component({
  selector: 'app-admin-section-type-likert-scale',
  templateUrl: './type-likert-scale.component.html',
  styleUrls: ['./type-likert-scale.component.scss']
})
export class TypeLikertScaleComponent {

  @Input() isEditable = false;
  @Input() set section(value: ExecutiveSection) {
    this._section = value;
    this._content = <SectionLikertScale>this._section.content;
    this.textColor('title');
    this.textColor('abstract');
    this.textColor('name', 1);
    this.textColor('legend', 1);
  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();
  @Output() playSection: EventEmitter<void> = new EventEmitter<void>();

  private _colorsAndNames = colorsAndNames;
  private _section: ExecutiveSection = <ExecutiveSection>{};
  private _titleColor = '';
  private _abstractColor = '';
  private _legendColor = '';

  private _content: SectionLikertScale = {
    name: this._colorsAndNames[2].name,
    legend: '',
    color: this._colorsAndNames[2].color
  };


  constructor() { }

  public emitChanges() {
    if (this.isEditable) {
      this._section.content = this._content;
      this.sectionChange.emit(this._section);
    }
  }

  public textColor(field: string, index?: number) {
    switch (field) {

      case 'title':
        this._titleColor = CommonService.getLimitColor(this._section.title, 40);
        break;

      case 'abstract':
        this._abstractColor = CommonService.getLimitColor(this._section.abstract, 175);
        break;

      case 'legend':
          this._legendColor = CommonService.getLimitColor(this._content && this._content.legend, 13);
        break;
    }
  }


  public onClickPlay(event: Event) {
    event.preventDefault();
    this.playSection.emit();
  }

  public chooseColor(index: number) {

    this._content.color = this._colorsAndNames[index].color;
    this._content.name = this._colorsAndNames[index].name;
    this.emitChanges();
  }

  /*public checkVisibility(index: number) {
    this._content.name[index].visibility = this._content.name[index].name !== '';
  }*/

  get section(): ExecutiveSection {
    return this._section;
  }

  get content(): SectionLikertScale {
    return this._content;
  }

  get titleColor(): string {
    return this._titleColor;
  }

  get abstractColor(): string {
    return this._abstractColor;
  }

  get legendColor(): string {
    return this._legendColor;
  }

  get colorsAndNames(): { name: string , color: string; }[] {
    return this._colorsAndNames;
  }
}
