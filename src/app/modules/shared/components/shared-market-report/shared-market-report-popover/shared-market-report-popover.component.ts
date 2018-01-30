/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'market-report-popover',
  templateUrl: 'shared-market-report-popover.component.html',
  styleUrls: ['shared-market-report-popover.component.scss']
})

export class SharedMarketReportPopoverComponent implements OnInit {

  @Input() public answers: any;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {

  }

  public buildImageUrl(country: any): string {
    if (country && country.notation) return `https://res.cloudinary.com/umi/image/upload/app/${country.notation}.png`;
    return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
  }

  public seeAnswer(answer: any) {
    this.modalAnswerChange.emit(answer);
  }

}
