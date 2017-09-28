/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'market-comment',
  templateUrl: 'shared-market-comment.component.html',
  styleUrls: ['shared-market-comment.component.scss']
})

export class SharedMarketCommentComponent implements OnInit {

  @Input() public country: any;
  @Input() public job: any;
  @Input() public company: any;
  @Input() public comment: any;
  @Input() public isNew: any;
  @Input() public professionals: any;


  constructor() { }

  ngOnInit() {
    console.log(this.professionals);
  }

  public buildImageUrl(country: string): string {
    return `https://res.cloudinary.com/umi/image/upload/v1506516853/Flags/${country}.png`;
  }

};
