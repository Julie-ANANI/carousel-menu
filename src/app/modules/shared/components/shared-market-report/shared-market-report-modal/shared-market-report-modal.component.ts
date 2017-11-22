/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'market-report-modal',
  templateUrl: 'shared-market-report-modal.component.html',
  styleUrls: ['shared-market-report-modal.component.scss']
})

export class SharedMarketReportModalComponent implements OnInit {
  
  private _modalAnswer: any;

  @Input() set modalAnswer(value: any) {
    this._modalAnswer = value;
  }

  constructor() { }

  ngOnInit() {

  }

  get modalAnswer(): any {
    return this._modalAnswer;
  }
}
