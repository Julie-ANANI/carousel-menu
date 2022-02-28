import {Component, Input, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {Mission} from '../../../../../../models/mission';

@Component({
  selector: 'app-market-report-result',
  templateUrl: './market-report-result.component.html',
  styleUrls: ['./market-report-result.component.scss']
})
export class MarketReportResultComponent implements OnInit {

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

  private _innovation: Innovation = <Innovation>{}

  private _mission: Mission = <Mission>{};

  constructor() { }

  ngOnInit(): void {
  }

}
