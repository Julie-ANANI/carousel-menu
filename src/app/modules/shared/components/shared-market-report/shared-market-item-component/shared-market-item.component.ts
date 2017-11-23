/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'market-item',
  templateUrl: 'shared-market-item.component.html',
  styleUrls: ['shared-market-item.component.scss']
})

export class SharedMarketItemComponent implements OnInit {

  @Input() public item: any;
  @Input() public isNew: any;
  @Input() public answers: any;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.item.link = "http://www." + this.item.url;
  }

  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

}
