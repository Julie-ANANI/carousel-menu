import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {Mission, MissionQuestion, MissionResultItem} from '../../../../../../models/mission';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {PageScrollService} from 'ngx-page-scroll-core';
import {DOCUMENT} from '@angular/common';
import {MissionFrontService} from '../../../../../../services/mission/mission-front.service';
import {Answer} from '../../../../../../models/answer';
import {likertScaleThresholds, ResponseService} from '../../services/response.service';

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

interface Scale {
  percentage: number;
  score: number;
  index: number
}

interface Item extends MissionResultItem {
  isFilled: boolean;
}

@Component({
  selector: 'app-market-report-result',
  templateUrl: './market-report-result.component.html',
  styleUrls: ['./market-report-result.component.scss']
})
export class MarketReportResultComponent implements OnInit {

  get addItemIndex(): number {
    return this._addItemIndex;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  get items(): Array<Item> {
    return this._items;
  }

  get scale(): Scale {
    return this._scale;
  }

  get questions(): Array<MissionQuestion> {
    return this._questions;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get label(): Label {
    return this._label;
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
    if (value && value._id) {
      this._innovation = value;
      if (this._innovation.mission && (<Mission>this._innovation.mission)._id) {
        this._mission = (<Mission>this._innovation.mission);
        this._essentialQuestions = MissionFrontService.essentialQuestions(MissionFrontService.totalTemplateQuestions(this._mission.template));
        this._reInitVariables();
        this._initData();
      }
    }
  }

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this._calculateScore();
  }

  @Input() scrollTo = '#';

  @Input() reportingLang = 'en';

  @Input() isEditable = false;

  @Output() saveInnovation: EventEmitter<Event> = new EventEmitter<Event>();

  private _canEdit: Toggle = <Toggle>{}

  private _innovation: Innovation = <Innovation>{}

  private _mission: Mission = <Mission>{};

  private _selectedItem: Item = <Item>{};

  private _resultItems: Array<MissionResultItem> = [];

  private _itemIndex = 0;

  private _essentialQuestions: Array<MissionQuestion> = [];

  private _showBarSection = false;

  private _showSeeMore = false;

  private _scale: Scale = <Scale>{};

  private _label: Label = <Label>{};

  private _questions: Array<MissionQuestion> = [];

  private _answers: Array<Answer> = [];

  private _items: Array<Item> = [];

  private _toBeSaved = false;

  private _addItemIndex = 0;

  constructor(@Inject(DOCUMENT) private _document: Document,
              private _innovationFrontService: InnovationFrontService,
              private _pageScrollService: PageScrollService) { }

  ngOnInit(): void {
  }

  /**
   * here we are determining the values for the progress bar based on the
   * essential questions. We use the same algorithm i.e. likert scale.
   * @private
   */
  private _calculateScore() {
    if (this._showBarSection) {
      this._scale = {percentage: 0, index: 0, score: 0};

      this._questions.forEach((_question) => {
        const {averageFinalScore} = ResponseService.likertScaleChartData(this._answers, _question, this.reportingLang);
        const {score, percentage} = ResponseService.getLikertScaleGraphicScore(averageFinalScore);
        this._scale.score += score;
        this._scale.percentage += percentage;
      });

      this._scale = {
        score: this._scale.score / this._questions.length,
        percentage: this._scale.percentage / this._questions.length,
        index: 1 // this will be overwritten next
      }

      this._setScaleLabelAndCursor();
    }
  }

  /**
   * setting the values based on the percentage and score
   * @private
   */
  private _setScaleLabelAndCursor() {
    this._label.left = this._scale.percentage < 50 ? this._scale.percentage + '%' : '';
    this._label.right = this._scale.percentage >= 50 ? (99 - this._scale.percentage) + '%' : '';
    this._label.margin = (this._scale.percentage >= 30 && this._scale.percentage <= 85) ? '-5%' : '';

    const thresholds = likertScaleThresholds(2.25, 5);

    if (this._scale.score < thresholds[0]) {
      this._scale.index = 0;
      this._label.color = 'color-1';
      this._label.label = 'MARKET_REPORT.RESULT.' + this._mission?.template?.methodology + '.BAR.LABEL_A';
    } else if (thresholds[0] <= this._scale.score && this._scale.score < thresholds[1]) {
      this._scale.index = 1;
      this._label.color = 'color-2';
      this._label.label = 'MARKET_REPORT.RESULT.' + this._mission?.template?.methodology + '.BAR.LABEL_B';
    } else if (thresholds[1] <= this._scale.score && this._scale.score < thresholds[2]) {
      this._scale.index = 2;
      this._label.color = 'color-3';
      this._label.label = 'MARKET_REPORT.RESULT.' + this._mission?.template?.methodology + '.BAR.LABEL_C';
    } else if (thresholds[2] <= this._scale.score && this._scale.score < thresholds[3]) {
      this._scale.index = 3;
      this._label.color = 'color-4';
      this._label.label = 'MARKET_REPORT.RESULT.' + this._mission?.template?.methodology + '.BAR.LABEL_D';
    } else {
      this._scale.index = 4;
      this._label.color = 'color-5';
      this._label.label = 'MARKET_REPORT.RESULT.' + this._mission?.template?.methodology + '.BAR.LABEL_E';
    }
  }

  /**
   * we initialize the items
   * @param total - number of the items based on the use case
   * @private
   */
  private _initItems(total: number) {
    for (let i = 0; i < total; i++) {
      if (this._resultItems.length && this._resultItems[i]) {
        this._items.push({
          ...this._resultItems[i],
          isFilled: true
        });
      } else {
        this._items.push(<Item>{});
      }
    }
  }

  private _reInitVariables() {
    this._toBeSaved = false;
    this._canEdit = <Toggle>{};
    this._items = [];
    this._resultItems = (this._mission && this._mission.result && this._mission.result.items) || [];
    this._addItemIndex = this._resultItems.length;
  }

  /**
   * initializing the different variables based on the use case.
   * @private
   */
  private _initData() {
    this._initItemIndex();

    if (!!this._mission.template && !!this._mission.template.methodology) {
      let ques1: MissionQuestion, ques2: MissionQuestion, ques3: MissionQuestion, ques4: MissionQuestion = <MissionQuestion>{};

      switch (this._mission.template && this._mission.template.methodology) {
        case 'DETECTING_MARKET':
          this._initItems(4);
          ques1 = this._getQuestion('InnovOpp');
          this._showBarSection = this._showSeeMore = !!(ques1 && ques1._id);
          if (this._showBarSection) {
            this._questions = [ques1];
          }
          break;

        case 'IDENTIFYING_RECEPTIVE':
        case 'SOURCING_SOLUTIONS':
          this._initItems(3);
          this._showSeeMore = true;
          break;

        case 'OPTIMIZING_VALUE':
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
    return this._essentialQuestions.find((_ques) => _ques.identifier === identifier && _ques.controlType === 'likert-scale');
  }

  private _initItemIndex() {
    this._itemIndex = this._resultItems.length;
  }

  public onChangeItem() {
    this._items[this._itemIndex] = this._selectedItem;
    this._items.forEach((_item) => _item.isFilled = !!(_item.title || _item.content));
    this._toBeSaved = true;
    this._notifyChanges();
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
        this._selectedItem = <Item>{};
        this._initItemIndex();
        break;
      case 'editItem':
        this._selectedItem = this._items[this._itemIndex];
        break;
    }

    this._canEdit[btn] = !this._canEdit[btn];

    if (btn === 'addItem' && !this._canEdit.addItem) {
      this._addItemIndex = this._resultItems.length + 1;
    }

    if (!this._canEdit[btn]) {
      this._saveResult(event);
    }
  }

  /**
   * call the back to save the mission result.
   * @private
   */
  private _saveResult(event: Event) {
    if (this._toBeSaved) {
      this.saveInnovation.emit(event);
    }
  }

  /**
   * save the abstract
   * @param event
   */
  public keyupHandlerFunction(event: {content: string}) {
    this._mission.result.abstract = event['content'];
    this._toBeSaved = true;
    this._notifyChanges();
  }

  private _notifyChanges() {
    if (this.isEditable) {
      this._resultItems = this._items.filter((_item) => !!_item.isFilled).map((val) => {
        return {
          title: val.title,
          content: val.content
        }
      });
      this._mission.result.items = this._resultItems;
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
