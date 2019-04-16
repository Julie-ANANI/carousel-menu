import {Component, Input, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../../models/innovation';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {PaginationInterface} from '../../../../../../utility-components/pagination/interfaces/pagination';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  animations: [

    trigger('cardAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0, transform: 'translateX(-15%)' }), { optional: true }),

        query(':enter', stagger('100ms', [
          animate('.15s ease', style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          )]
        ), { optional: true }),

      ])
    ])

  ]
})

export class CardsComponent implements OnInit {

  @Input() set allInnovations(value: Array<Innovation>) {
    if (value) {
      this.innovations = value;
      this.totalInnovations = value.length;
    }
  }

  @Input() set pagination(value: boolean) {
    if (value) {
      this.isPagination = value;
    }
  }


  @Input() set startingIndex(value: number) {
    if (value) {
      this.startIndex = value;
    }
  }

  @Input() set endingIndex(value: number) {
    if (value) {
      this.endIndex = value;
    }
  }

  paginationValue: PaginationInterface = {};

  innovations: Array<Innovation> = [];

  totalInnovations: number;

  startIndex: number = 0;

  endIndex: number;

  isPagination: boolean = false;

  constructor() { }

  ngOnInit() {
    this.paginationValue = { limit: 50, offset: 0 };
  }

}
