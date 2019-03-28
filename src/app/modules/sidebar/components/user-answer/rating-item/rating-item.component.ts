import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rating-item',
  templateUrl: './rating-item.component.html',
  styleUrls: ['./rating-item.component.scss']
})

export class RatingItemComponent {

  @Input() editMode: boolean;

  @Input() prop: string;

  @Input() set rating(value: number) {
    this._rating = Number.isInteger(value) ? value : 1;
  }

  @Output() ratingChange = new EventEmitter<any>();

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
