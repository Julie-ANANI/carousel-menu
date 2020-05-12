import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../models/innovation';
import { ExecutiveReport } from '../../../models/executive-report';
import { InnovationFrontService } from '../../../services/innovation/innovation-front.service';

@Component({
  selector: 'executive-report',
  templateUrl: './print-executive-report.component.html',
  styleUrls: ['./print-executive-report.component.scss']
})

export class PrintExecutiveReportComponent implements OnInit {

  private _data: Innovation | ExecutiveReport = <Innovation | ExecutiveReport>{};

  private _title = '';

  private _media = '';

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    if (this._activatedRoute.snapshot.data.report && typeof this._activatedRoute.snapshot.data.report !== undefined) {
      this._data = <ExecutiveReport>this._activatedRoute.snapshot.data.report;
      this._initData();
    } else if (this._activatedRoute.snapshot.parent.data.innovation && typeof this._activatedRoute.snapshot.parent.data.innovation !== undefined) {
      this._data = <Innovation>this._activatedRoute.snapshot.parent.data.innovation;
    }

  }

  /***
   * if we have executive report we need to get other data for that report from the innovation like,
   * Title, Media.
   * object.
   * @private
   */
  private _initData() {
    const innovation: Innovation = this._activatedRoute.snapshot.parent.data && this._activatedRoute.snapshot.parent.data.innovation
      && <Innovation>this._activatedRoute.snapshot.parent.data.innovation;
    this._title = InnovationFrontService.currentLangInnovationCard(innovation, this.data['lang'], 'title');
    this._media = InnovationFrontService.principalMedia(innovation, this.data['lang'], '173', '110');
  }

  get data(): Innovation | ExecutiveReport {
    return this._data;
  }

  get title(): string {
    return this._title;
  }

  get media(): string {
    return this._media;
  }

}
