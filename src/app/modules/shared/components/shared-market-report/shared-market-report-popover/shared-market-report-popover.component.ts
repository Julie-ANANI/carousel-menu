/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../models/answer';

@Component({
  selector: 'market-report-popover',
  templateUrl: 'shared-market-report-popover.component.html',
  styleUrls: ['shared-market-report-popover.component.scss']
})

export class SharedMarketReportPopoverComponent {

  @Input() public answers: Array<Answer>;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  public buildImageUrl(country: any): string {
    if (country && country.flag) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country.flag}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }

  public seeAnswer(event: Event, answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }

}
