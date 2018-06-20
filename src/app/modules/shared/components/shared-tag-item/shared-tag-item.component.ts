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

  @Input() public tags: Array<Tag>;
  @Input() public editMode = false;

  @Output() addTag: EventEmitter<Tag> = new EventEmitter();
  @Output() removeTag: EventEmitter<Tag> = new EventEmitter();

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

  public _addTag(event: {value: Tag}): void {
    this.addTag.emit(event.value);
  }

  public _removeTag(event: {value: Tag}): void {
    this.removeTag.emit(event.value);
  }

  get lang(): string { return this._translateService.currentLang; }
}
