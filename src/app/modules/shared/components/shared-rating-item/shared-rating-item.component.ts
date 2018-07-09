import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-rating-item',
  templateUrl: './shared-rating-item.component.html',
  styleUrls: ['./shared-rating-item.component.scss']
})

export class SharedRatingItemComponent {

  @Input() big: string;
  @Input() editMode: boolean;
  @Output() ratingChange = new EventEmitter<any>();
  @Input() prop: string;

  @Input() set rating(value: number) {
    this._rating = Number.isInteger(value) ? value : 1;
  }

  private _rating: number;

  constructor() {}

  thumbsUp(event: Event) {
    event.preventDefault();

    if (this.editMode) {
      if (this._rating === 2) {
        this._rating = 1;
      } else {
        this._rating = 2;
      }
      this.ratingChange.emit({key: this.prop, value: this._rating});
    }

  }

  thumbsDown(event: Event) {
    event.preventDefault();

    if (this.editMode) {
      if (this._rating === 0) {
        this._rating = 1;
      } else {
        this._rating = 0;
      }
      this.ratingChange.emit({key: this.prop, value: this._rating});
    }

  }

  get rating() {
    return this._rating;
  }

}
