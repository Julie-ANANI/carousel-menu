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
    this.rating = this.rating || 1;
  }

  thumbsUp(event: Event) {
    event.preventDefault();
    if (this.adminMode) {
      if (this.rating === 2) {
        this.rating = 1;
      } else {
        this.rating = 2;
      }
      this.ratingChange.emit({key: this.prop, value: this.rating});
    }
  }

  thumbsDown(event: Event) {
    event.preventDefault();
    if (this.adminMode) {
      if (this.rating === 0) {
        this.rating = 1;
      } else {
        this.rating = 0;
      }
      this.ratingChange.emit({key: this.prop, value: this.rating});
    }
  }
}
