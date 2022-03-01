import {Component, Inject, Input, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {Mission} from '../../../../../../models/mission';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {PageScrollService} from 'ngx-page-scroll-core';
import {DOCUMENT} from '@angular/common';

interface Toggle {
  abstract: boolean
}

@Component({
  selector: 'app-market-report-result',
  templateUrl: './market-report-result.component.html',
  styleUrls: ['./market-report-result.component.scss']
})
export class MarketReportResultComponent implements OnInit {

  get toggleEdit(): Toggle {
    return this._toggleEdit;
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
    }
  }

  @Input() reportingLang = 'en';

  @Input() isEditable = false;

  private _toggleEdit: Toggle = <Toggle>{}

  private _innovation: Innovation = <Innovation>{}

  private _mission: Mission = <Mission>{};

  constructor(@Inject(DOCUMENT) private _document: Document,
              private _innovationFrontService: InnovationFrontService,
              private _pageScrollService: PageScrollService,) { }

  ngOnInit(): void {
  }

  /**
   * toggle edit btn
   * @param event
   * @param btn
   */
  public toggleBtn(event: Event, btn: 'abstract') {
    event.preventDefault();
    this._toggleEdit[btn] = !this._toggleEdit[btn];
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
    this._innovationFrontService.setNotifyChanges({key: 'marketReportResult', state: true});
  }

  public onClickSeeMore(event: Event) {
    event.preventDefault();
    this._pageScrollService.scroll({
      document: this._document,
      scrollTarget: '#origin-responses'
    });
  }

}
