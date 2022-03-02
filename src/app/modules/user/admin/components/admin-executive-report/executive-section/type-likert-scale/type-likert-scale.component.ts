import {Component, EventEmitter, Input, Output,OnInit, OnDestroy} from '@angular/core';
import {
  ExecutiveSection,
  SectionLikertScale
} from '../../../../../../../models/executive-report';
import {CommonService} from '../../../../../../../services/common/common.service';
import colorsAndNames from '../../../../../../../../../assets/json/likert-scale_executive-report.json';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-admin-section-type-likert-scale',
  templateUrl: './type-likert-scale.component.html',
  styleUrls: ['./type-likert-scale.component.scss']
})

export class TypeLikertScaleComponent implements OnInit, OnDestroy {

  @Input() reportingLang = this._translateService.currentLang;
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

  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _colorsAndNames = colorsAndNames;
  private _section: ExecutiveSection = <ExecutiveSection>{};
  private _titleColor = '';
  private _abstractColor = '';
  private _legendColor = '';
  private _nameColor = '';
  private _label: any = 'VALIDATED'

  private _content: SectionLikertScale = {
    name: this._colorsAndNames[2].name,
    legend: '',
    color: this._colorsAndNames[2].color
  };

  constructor (private _translateService: TranslateService ) {}

  ngOnInit(): void {
    this._label = this.getLikertText(this._content.name);
  }

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

      case 'name':
        this._nameColor = CommonService.getLimitColor(this._content && this._content.name, 20);
    }
  }

  public changeValueLabel (event: string) {
    this._content.name = event;
    this._label= this.getLikertText(event);
  }

  /*This function replaces the default result with what is typed in the input.
  Translating initially to a specific text caused problems when you only
  wanted to change the content.name*/
  public getLikertText(name: string) {
    const nameScore = ['TOTALLY_INVALIDATED', 'INVALIDED','UNCERTAIN','VALIDATED','TOTALLY_VALIDATED'];

    if (nameScore.indexOf(name.toUpperCase()) === -1) {
      return name;
    } else{
      const translate = 'ADMIN_EXECUTIVE_REPORT.LIKERT-SCALE_SECTION.'
      return translate + name.toUpperCase();
    }
  }

  public onClickPlay(event: Event) {
    event.preventDefault();
    this.playSection.emit();
  }

  public chooseColor(index: number) {
    this._content.color = this._colorsAndNames[index].color;
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

  get label():string {
    return this._label;
  }

  get nameColor():string {
    return this._nameColor;
  }


  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
