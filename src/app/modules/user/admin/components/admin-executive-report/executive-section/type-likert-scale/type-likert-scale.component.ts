import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ExecutiveSection, SectionRanking} from '../../../../../../../models/executive-report';
import {CommonService} from '../../../../../../../services/common/common.service';

@Component({
  selector: 'app-admin-section-type-likert-scale',
  templateUrl: './type-likert-scale.component.html'
})
export class TypeLikertScaleComponent {

  @Input() isEditable = false;

  @Input() set section(value: ExecutiveSection) {
    this._section = value;
    this._content = <SectionRanking>this._section.content;
    this.textColor('title');
    this.textColor('abstract');
    this.textColor('name', 1);
    this.textColor('name', 2);
    this.textColor('name', 3);
    this.textColor('legend', 1);
    this.textColor('legend', 2);
    this.textColor('legend', 3);
  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  @Output() playSection: EventEmitter<void> = new EventEmitter<void>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionRanking = {
    values: []
  };

  private _titleColor = '';

  private _abstractColor = '';

  private _resultsColor = '';

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

      case 'name':
          this._resultsColor = CommonService.getLimitColor(this._content.values[0] && this._content.values[0].name, 20);


        break;

    }
  }

  public checkVisibility(index: number) {
    this._content.values[index].visibility = this._content.values[index].name !== '';
  }

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

  get content(): SectionRanking {
    return this._content;
  }

  get titleColor(): string {
    return this._titleColor;
  }

  get abstractColor(): string {
    return this._abstractColor;
  }

  get resultsColor(): string {
    return this._resultsColor;
  }

}
