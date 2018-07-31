import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { Filter } from '../../models/filter';

@Component({
  selector: 'app-market-report-popover',
  templateUrl: 'shared-market-report-popover.component.html',
  styleUrls: ['shared-market-report-popover.component.scss']
})

export class SharedMarketReportPopoverComponent {

  @Input() public answers: Array<Answer>;

  @Output() addFilter = new EventEmitter<Filter>();
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  public seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }

}
