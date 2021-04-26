import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveSection, SectionBar } from '../../../../../../../models/executive-report';
import { CommonService } from '../../../../../../../services/common/common.service';

@Component({
  selector: 'app-admin-section-type-bar',
  templateUrl: './type-bar.component.html',
  styleUrls: ['./type-bar.component.scss']
})

export class TypeBarComponent {

  @Input() isEditable = false;

  @Input() lang = 'en';

  @Input() set section(value: ExecutiveSection) {
    this._section = value;
    this._content = <SectionBar>this._section.content;
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

  private _content: SectionBar = {
    showExamples: true,
    values: []
  };

  private _titleColor = '';

  private _abstractColor = '';

  private _name1Color = '';

  private _name2Color = '';

  private _name3Color = '';

  private _example1Color = '';

  private _example2Color = '';

  private _example3Color = '';

  constructor() { }

  public emitChanges() {
    if (this.isEditable) {
      this._section.content = this._content;
      this.sectionChange.emit(this._section);
    }
  }

  public toggleExamples() {
    this._content.showExamples = !this._content.showExamples;
    this.emitChanges();
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
        if (index === 1) {
          this._name1Color = CommonService.getLimitColor(this._content.values[0] && this._content.values[0].name, 32);
        } else if (index === 2) {
          this._name2Color = CommonService.getLimitColor(this._content.values[1] && this._content.values[1].name, 32);
        } else if (index === 3) {
          this._name3Color = CommonService.getLimitColor(this._content.values[2] && this._content.values[2].name, 32);
        }
        break;

      case 'legend':
        if (index === 1) {
          this._example1Color = CommonService.getLimitColor(this._content.values[0] && this._content.values[0].legend, 40);
        } else if (index === 2) {
          this._example2Color = CommonService.getLimitColor(this._content.values[1] && this._content.values[1].legend, 40);
        } else if (index === 3) {
          this._example3Color = CommonService.getLimitColor(this._content.values[2] && this._content.values[2].legend, 40);
        }
        break;

    }
  }

  public checkVisibility(index: number) {
    this._content.values[index].visibility = this._content.values[index].percentage !== 0;
    this.emitChanges();
  }

  public onClickPlay(event: Event) {
    event.preventDefault();
    this.playSection.emit();
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

  get name1Color(): string {
    return this._name1Color;
  }

  get name2Color(): string {
    return this._name2Color;
  }

  get name3Color(): string {
    return this._name3Color;
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
