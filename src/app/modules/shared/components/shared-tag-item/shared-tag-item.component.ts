import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MultilingPipe } from '../../../../pipes/multiling/multiling.pipe';
import { Tag } from '../../../../models/tag';

@Component({
  selector: 'shared-tag-item',
  templateUrl: './shared-tag-item.component.html',
  styleUrls: ['./shared-tag-item.component.scss']
})
export class SharedTagItemComponent implements OnInit {
  @Input() tags: Array<Tag>;

  @Output() addTag: EventEmitter<Tag> = new EventEmitter();
  @Output() removeTag: EventEmitter<Tag> = new EventEmitter();

  private _displayTags = true;
  public tagsAutocomplete: any;

  constructor(private _translateService: TranslateService) {}

  ngOnInit() {
    this.tagsAutocomplete = {
      placeholder: 'tags',
      initialData: this.tags.map(t => {
        t['name'] = MultilingPipe.prototype.transform(t['label'], this._translateService.currentLang);
        return t;
      }) || [],
      type: 'tags'
    };
  }

  toggleTags(event: Event) {
    event.preventDefault();
    this._displayTags = !this._displayTags;
  }

  public _addTag(event: {value: Tag}): void {
    this.addTag.emit(event.value);
  }

  public _removeTag(event: {value: Tag}): void {
    this.removeTag.emit(event.value);
  }

  set displayTags(value: boolean) { this._displayTags = value; }
  get displayTags(): boolean { return this._displayTags; }
}
