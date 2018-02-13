import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'shared-tag-item',
  templateUrl: './shared-tag-item.component.html',
  styleUrls: ['./shared-tag-item.component.scss']
})
export class SharedTagItemComponent implements OnInit {
  @Input() tags: Array<string>;
  @Input() big: string;
  @Output() tagsChange = new EventEmitter <any>();
  @Input() prop: string;

  private _displayTags = false;

  constructor() {}

  ngOnInit() {
    this.tags = this.tags || [];
  }

  toggleTags(event: Event) {
    event.preventDefault();
    this._displayTags = !this._displayTags;
  }

  updateTags(event: {value: Array<string>}) {
    this.tagsChange.emit(event.value);
  }

  set displayTags(value: boolean) { this._displayTags = value; }
  get displayTags(): boolean { return this._displayTags; }
}
