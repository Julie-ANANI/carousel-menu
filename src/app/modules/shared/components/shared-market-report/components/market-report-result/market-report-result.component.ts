import {Component, Inject, Input, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {Mission, MissionQuestion, MissionResultItem} from '../../../../../../models/mission';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {PageScrollService} from 'ngx-page-scroll-core';
import {DOCUMENT} from '@angular/common';
import {MissionFrontService} from '../../../../../../services/mission/mission-front.service';
import {Answer} from '../../../../../../models/answer';

type toggleType = 'abstract' | 'addItem' | 'editItem';

interface Toggle {
  abstract: boolean;
  addItem: boolean;
  editItem: boolean;
}

interface Label {
  color: 'color-1' | 'color-2' | 'color-3' | 'color-4' | 'color-5';
  label: string;
  margin: string;
  left: string;
  right: string;
}

@Component({
  selector: 'app-market-report-result',
  templateUrl: './market-report-result.component.html',
  styleUrls: ['./market-report-result.component.scss']
})
export class MarketReportResultComponent implements OnInit {

  get questions(): Array<MissionQuestion> {
    return this._questions;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get activeBar(): number {
    return this._activeBar;
  }

  get label(): Label {
    return this._label;
  }

  get score(): number {
    return this._score;
  }

  get showSeeMore(): boolean {
    return this._showSeeMore;
  }

  get showBarSection(): boolean {
    return this._showBarSection;
  }

  get itemIndex(): number {
    return this._itemIndex;
  }

  set itemIndex(value: number) {
    this._itemIndex = value;
  }

  get resultItems(): Array<MissionResultItem> {
    return this._resultItems;
  }

  get selectedItem(): MissionResultItem {
    return this._selectedItem;
  }

  get canEdit(): Toggle {
    return this._canEdit;
  }

  get mission(): Mission {
    return this._mission;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  @Input() set innovation(value: Innovation) {
    this._innovation = value;
    if (this._innovation.mission && (<Mission>this._innovation.mission)._id) {
      this._initData();
    }
  }

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this._calculateScore();
  }

  @Input() scrollTo = '#';

  @Input() reportingLang = 'en';

  @Input() isEditable = false;

  private _canEdit: Toggle = <Toggle>{}

  private _innovation: Innovation = <Innovation>{}

  private _mission: Mission = <Mission>{};

  private _selectedItem: MissionResultItem = <MissionResultItem>{};

  private _resultItems: Array<MissionResultItem> = [];

  private _itemIndex = 0;

  private _essentialQuestions: Array<MissionQuestion> = [];

  private _showBarSection = false;

  private _showSeeMore = false;

  private _score = 0;

  private _label: Label = <Label>{};

  private _activeBar: number = 0;

  private _questions: Array<MissionQuestion> = [];

  private _answers: Array<Answer> = [];

  constructor(@Inject(DOCUMENT) private _document: Document,
              private _innovationFrontService: InnovationFrontService,
              private _pageScrollService: PageScrollService,) { }

  ngOnInit(): void {
  }

  private _calculateScore() {
    if (this._showBarSection) {

      switch (this._mission.template && this._mission.template.methodology) {
        case 'DETECTING_MARKET':
          break;

        case 'VALIDATING_INTEREST':
          break;

        case 'VALIDATING_MARKET':
          break;
      }

      this._setLabel();
    }
  }

  private _setLabel() {
    this._label.left = this._score < 85 ? this._score + '%' : '';
    this._label.right = this._score >= 85 ? (99 - this._score) + '%' : '';
    this._label.margin = (this._score >= 30 && this._score <= 85) ? '-5%' : '';

    if (this._score >= 0 && this._score < 20) {
      this._activeBar = 0;
      this._label.color = 'color-1';
      this._label.label = 'MARKET_REPORT.RESULT.' + this._mission?.template?.methodology + '.BAR.LABEL_A';
    } else if (this._score >= 20 && this._score < 40) {
      this._activeBar = 1;
      this._label.color = 'color-2';
      this._label.label = 'MARKET_REPORT.RESULT.' + this._mission?.template?.methodology + '.BAR.LABEL_B';
    } else if (this._score >= 40 && this._score < 60) {
      this._activeBar = 2;
      this._label.color = 'color-3';
      this._label.label = 'MARKET_REPORT.RESULT.' + this._mission?.template?.methodology + '.BAR.LABEL_C';
    } else if (this._score >= 60 && this._score < 80) {
      this._activeBar = 3;
      this._label.color = 'color-4';
      this._label.label = 'MARKET_REPORT.RESULT.' + this._mission?.template?.methodology + '.BAR.LABEL_D';
    } else {
      this._activeBar = 4;
      this._label.color = 'color-5';
      this._label.label = 'MARKET_REPORT.RESULT.' + this._mission?.template?.methodology + '.BAR.LABEL_E';
    }
  }

  private _initData() {
    this._mission = (<Mission>this._innovation.mission);
    this._resultItems = this._mission?.result?.items || [];
    this._essentialQuestions = MissionFrontService.essentialQuestions(MissionFrontService.totalTemplateQuestions(this._mission.template));
    this._initItemIndex();

    if (!!this._mission.template && !!this._mission.template.methodology) {
      let ques1: MissionQuestion, ques2: MissionQuestion, ques3: MissionQuestion, ques4: MissionQuestion = <MissionQuestion>{};

      switch (this._mission.template && this._mission.template.methodology) {
        case 'DETECTING_MARKET':
          ques1 = this._getQuestion('InnovOpp');
          this._showBarSection = this._showSeeMore = !!(ques1 && ques1._id);
          if (this._showBarSection) {
            this._questions = [ques1];
          }
          break;

        case 'IDENTIFYING_RECEPTIVE':
        case 'SOURCING_SOLUTIONS':
          this._showSeeMore = true;
          break;

        case 'VALIDATING_INTEREST':
          ques1 = this._getQuestion('ExistenceOfNeeds');
          ques2 = this._getQuestion('CritOfNeeds');
          ques3 = this._getQuestion('ValueOfSol');
          ques4 = this._getQuestion('Adaptability');
          this._showBarSection = this._showSeeMore = !!(ques1 && ques1._id && ques2 && ques2._id && ques3 && ques3._id
            && ques4 && ques4._id);
          if (this._showBarSection) {
            this._questions = [ques1, ques2, ques3, ques4];
          }
          break;

        case 'VALIDATING_MARKET':
          ques1 = this._getQuestion('ExistenceOfNeeds');
          ques2 = this._getQuestion('CritOfNeeds');
          this._showBarSection = this._showSeeMore = !!(ques1 && ques1._id && ques2 && ques2._id);
          if (this._showBarSection) {
            this._questions = [ques1, ques2];
          }
          break;
      }
    }
  }

  private _getQuestion(identifier: string): MissionQuestion {
    return MissionFrontService.question(this._essentialQuestions, 'identifier', identifier);
  }

  private _initItemIndex() {
    this._itemIndex = this._resultItems.length;
  }

  public onChangeItem() {
    if (!!this._resultItems[this._itemIndex]) {
      this._resultItems[this._itemIndex] = this._selectedItem;
    } else if ((this._resultItems.length < 3 && this._mission.template.methodology !== 'DETECTING_MARKET')
      || (this._resultItems.length < 4 && this._mission.template.methodology === 'DETECTING_MARKET')) {
      this._resultItems.push(this._selectedItem);
    }
    this._sliceItem(this._itemIndex)
    this._notifyChanges();
  }

  private _sliceItem(index: number){
    if (!this._selectedItem.title && !this._selectedItem.content) {
      this._resultItems.splice(index, 1);
    }
  }

  /**
   * toggle edit btn
   * @param event
   * @param btn
   */
  public onToggle(event: Event, btn: toggleType) {
    event.preventDefault();

    switch (btn) {
      case 'addItem':
        this._selectedItem = <MissionResultItem>{};
        this._initItemIndex();
        break;
      case 'editItem':
        this._selectedItem = this._resultItems[this._itemIndex];
        break;
    }

    this._canEdit[btn] = !this._canEdit[btn];
  }

  /**
   * save the abstract
   * @param event
   */
  public keyupHandlerFunction(event: {content: string}) {
    this._mission.result.abstract = event['content'];
    this._notifyChanges();
  }

  private _notifyChanges() {
    if (this.isEditable) {
      this._innovationFrontService.setNotifyChanges({key: 'marketReportResult', state: true});
    }
  }

  public onClickSeeMore(event: Event) {
    event.preventDefault();
    this._pageScrollService.scroll({
      document: this._document,
      scrollTarget: this.scrollTo,
      scrollOffset: 50
    });
  }

}
