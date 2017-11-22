/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';

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

  public click(event) {
    event.stopPropagation();
    let selectedMenu = $(event.target).next(".users-menu");
    // On replie tous les menus sauf celui sélectionné
    $(".users-menu").not(selectedMenu).slideUp("fast");
    selectedMenu.slideToggle("fast");
  }

  public buildImageUrl(country: string): string {
    return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
  }

  public seeAnswer(answer: any) {
    this.modalAnswerChange.emit(answer);
  }

}
