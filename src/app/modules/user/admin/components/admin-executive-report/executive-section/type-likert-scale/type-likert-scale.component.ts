import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ExecutiveSection,
  SectionLikertScale
} from '../../../../../../../models/executive-report';
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
    this.textColor('title');
    this.textColor('abstract');
    this.textColor('name', 1);
    this.textColor('legend', 1);
  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();
  @Output() playSection: EventEmitter<void> = new EventEmitter<void>();

 /* the names of the colours are already defined*/
  private _colorsAndNames = [
    { color: '#EA5858', name: 'TOTALLY_INVALIDATED'},
    { color: '#F89424', name: 'INVALIDED'},
    { color: '#BBC7D6', name: 'UNCERTAIN'},
    { color: '#99E04B', name: 'VALIDATED'},
    { color: '#2ECC71', name: 'TOTALLY_VALIDATED'}
  ]

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionLikertScale = {
    name: this._colorsAndNames[2].name,
    legend: '',
    color: this._colorsAndNames[2].color
  };

  private _titleColor = '';
  private _abstractColor = '';
  private _legendColor = '';


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

  get colorsAndNames(): { color: string; name: string }[] {
    return this._colorsAndNames;
  }
}
