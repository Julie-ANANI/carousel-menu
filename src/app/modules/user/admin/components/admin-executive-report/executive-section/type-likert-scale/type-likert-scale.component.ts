import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ExecutiveSection, SectionLikertScale} from '../../../../../../../models/executive-report';
import {CommonService} from '../../../../../../../services/common/common.service';

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
    this._color =<SectionLikertScale>this._section.color;
    this.textColor('title');
    this.textColor('abstract');
    this.textColor('name', 1);
    this.textColor('legend', 1);
  }

 /* @Input() set sectionLikert(value : SectionLikertScale){
    this._sectionLikertScale = value;
    this.textColor('color', 1);
  }*/


  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();
  @Output() playSection: EventEmitter<void> = new EventEmitter<void>();

  private _section: ExecutiveSection = <ExecutiveSection>{};
  private _content: SectionLikertScale = {values: []};
  private _titleColor = '';
  private _abstractColor = '';
  private _legendColor = '';
  private _color: SectionLikertScale = <string>{};
  constructor() { }

  public emitChanges() {
    if (this.isEditable) {
      this._section.content = this._content;
      this.sectionChange.emit(this._section);
      this._section.color = this._color;
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
          this._legendColor = CommonService.getLimitColor(this._content.values[0] && this._content.values[0].legend, 13);
        break;

      case 'color':
        this._color = CommonService.getLimitColor(this._section.color[0], 1);

    }
  }

  /*public checkVisibility(index: number) {
    this._content.values[index].visibility = this._content.values[index].name !== '';
  }*/

  public onClickPlay(event: Event) {
    event.preventDefault();
    this.playSection.emit();
  }

  public setColor(value: string, index: number) {
    this._content.values[index].color = value;
    this.emitChanges();
  }


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

  get color(): SectionLikertScale {
    return this._color;
  }
}
