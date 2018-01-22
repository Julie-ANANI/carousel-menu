import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'shared-rating-item',
  templateUrl: './shared-rating-item.component.html',
  styleUrls: ['./shared-rating-item.component.scss']
})
export class SharedRatingItemComponent implements OnInit {
  @Input() rating: number;
  @Input() big: string;
  @Input() adminMode: boolean;
  @Output() ratingChange = new EventEmitter <any>(); 
  @Input() prop: string;

  constructor() {
  }

  ngOnInit() {
    this.rating = this.rating || 0;
  }

  thumbsUp() {
    if (this.adminMode) {
      if (this.rating === 1) {
        this.rating = 0;
      } else {
        this.rating = 1;
      }
      this.ratingChange.emit({key: this.prop, value: this.rating});
    }
  }

  thumbsDown() {
    if (this.adminMode) {
      if (this.rating === -1) {
        this.rating = 0;
      } else {
        this.rating = -1;
      }
      this.ratingChange.emit({key: this.prop, value: this.rating});
    }
  }
}
