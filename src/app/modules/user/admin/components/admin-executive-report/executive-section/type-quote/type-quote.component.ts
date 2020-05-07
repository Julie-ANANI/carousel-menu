import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveSection, SectionQuote } from '../../../../../../../models/executive-report';
import { CommonService } from '../../../../../../../services/common/common.service';

@Component({
  selector: 'type-quote',
  templateUrl: './type-quote.component.html',
  styleUrls: ['./type-quote.component.scss']
})

export class TypeQuoteComponent {

  @Input() set section(value: ExecutiveSection) {
    this._section = value;
    this._content = <SectionQuote>this._section.content;
    this.textColor('title');
    this.textColor('abstract');
    this.textColor('quotation');
    this.textColor('name');
    this.textColor('job');
  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionQuote = {
    showQuotes: true,
    quotation: '',
    name: '',
    job: ''
  };

  private _titleColor = '';

  private _abstractColor = '';

  private _quoteColor = '';

  private _nameColor = '';

  private _jobColor = '';

  constructor() { }

  public emitChanges() {
    this._section.content = this._content;
    this.sectionChange.emit(this._section);
  }

  public textColor(field: string) {
    switch (field) {

      case 'title':
        this._titleColor = CommonService.getLimitColor(this._section.title.length, 26);
        break;

      case 'abstract':
        this._abstractColor = CommonService.getLimitColor(this._section.abstract.length, 175);
        break;

      case 'quotation':
        this._quoteColor = CommonService.getLimitColor(this._content.quotation.length, 100);
        break;

      case 'name':
        this._nameColor = CommonService.getLimitColor(this._content.name.length, 62);
        break;

      case 'job':
        this._jobColor = CommonService.getLimitColor(this._content.job.length, 62);
        break;

    }
  }

  public toggleQuotes() {
    this._content.showQuotes = !this._content.showQuotes;
    this.emitChanges();
  }

  get section(): ExecutiveSection {
    return this._section;
  }

  get content(): SectionQuote {
    return this._content;
  }

  get titleColor(): string {
    return this._titleColor;
  }

  get abstractColor(): string {
    return this._abstractColor;
  }

  get quoteColor(): string {
    return this._quoteColor;
  }

  get nameColor(): string {
    return this._nameColor;
  }

  get jobColor(): string {
    return this._jobColor;
  }

}
