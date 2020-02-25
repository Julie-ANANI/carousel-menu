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

    this._section = {
      questionId: value.questionId || '',
      questionType: value.questionType || '',
      abstract: value.abstract || '',
      title: value.title || '',
      content: {
        showQuotes: <SectionQuote>value.content && (<SectionQuote>value.content).showQuotes,
        quote: <SectionQuote>value.content && (<SectionQuote>value.content).quote ? (<SectionQuote>value.content).quote : '',
        author: {
          name: <SectionQuote>value.content && (<SectionQuote>value.content).author
          && (<SectionQuote>value.content).author.name ? (<SectionQuote>value.content).author.name : '',
          jobTitle: <SectionQuote>value.content && (<SectionQuote>value.content).author
          && (<SectionQuote>value.content).author.jobTitle ? (<SectionQuote>value.content).author.jobTitle : '',
        }
      }
    };

    this._content = <SectionQuote>this._section.content;

    this.textColor('title');
    this.textColor('abstract');
    this.textColor('quote');
    this.textColor('name');
    this.textColor('job');

  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionQuote = {
    showQuotes: true,
    quote: '',
    author: {
      name: '',
      jobTitle: ''
    }
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

      case 'quote':
        this._quoteColor = CommonService.getLimitColor(this._content.quote.length, 100);
        break;

      case 'name':
        this._nameColor = CommonService.getLimitColor(this._content.author.name.length, 62);
        break;

      case 'job':
        this._jobColor = CommonService.getLimitColor(this._content.author.jobTitle.length, 62);
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
