/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'market-comment',
  templateUrl: 'shared-market-comment.component.html',
  styleUrls: ['shared-market-comment.component.scss', '../shared-market-report/shared-market-report.component.scss']
})

export class SharedMarketCommentComponent {

  @Input() public country: any;
  @Input() public job: any;
  @Input() public company: any;
  @Input() public comment: any;
  @Input() public isNew: any;
  @Input() public answers: any;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  public buildImageUrl(country: string): string {
    return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
  }

  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

};
