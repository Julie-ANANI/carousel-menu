import {Component, Inject, Input, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {Mission, MissionResultItem} from '../../../../../../models/mission';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {PageScrollService} from 'ngx-page-scroll-core';
import {DOCUMENT} from '@angular/common';

type toggleType = 'abstract' | 'addItem' | 'editItem';

interface Toggle {
  abstract: boolean;
  addItem: boolean;
  editItem: boolean;
}

@Component({
  selector: 'app-market-report-result',
  templateUrl: './market-report-result.component.html',
  styleUrls: ['./market-report-result.component.scss']
})
export class MarketReportResultComponent implements OnInit {

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
      this._mission = (<Mission>this._innovation.mission);
      this._resultItems = this._mission?.result?.items || [];
      this._initItemIndex();
    }
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

  constructor(@Inject(DOCUMENT) private _document: Document,
              private _innovationFrontService: InnovationFrontService,
              private _pageScrollService: PageScrollService,) { }

  ngOnInit(): void {
  }

  private _initItemIndex() {
    this._itemIndex = this._resultItems.length;
  }

  public onChangeItem() {
    if (!!this._resultItems[this._itemIndex]) {
      this._resultItems[this._itemIndex] = this._selectedItem;
    } else if (this._resultItems.length < 3) {
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
