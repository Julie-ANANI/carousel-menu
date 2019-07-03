import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { TagsService } from '../../../../services/tags/tags.service';
import { Multiling } from '../../../../models/multiling';
import { Tag } from '../../../../models/tag';
import { Innovation } from '../../../../models/innovation';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { MultilingPipe } from '../../../../pipe/pipes/multiling.pipe';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})

export class TagsComponent {

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this._tags = [];
    }
  }

  @Input() set tags(tags: Array<Tag>) {
    this._tags = [...tags];
  }

  @Input() set tag(tag: Tag) {
    if (tag) {
      this._tag = {...tag};
      this.needToSetOriginalTag = !(tag.originalTagId);
    }
  }

  @Input() set project(value: Innovation) {
    this._innovationId = value._id;
  }

  @Input() set type(type: string) {
    this._type = type;
  }

  @Input() set tagType(value: string) {
    this._tagType = value;
  }

  @Output() newTags = new EventEmitter<Tag[]>();

  @Output() updateTag = new EventEmitter<Tag>();

  private _tags: Tag[] = [];

  private _tag: Tag;

  private _innovationId = '';

  private _type = '';

  public needToSetOriginalTag = false;

  private _tagType: string;

  constructor(private _tagsService: TagsService,
              private _autocompleteService: AutocompleteService,
              private _multiling: MultilingPipe,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateService: TranslateService,
              private _domSanitizer: DomSanitizer) { }


  public suggestions(query: string): Observable<Array<any>> {
    const queryConf = {
      query: query,
      type: 'tags'
    };
    return this._autocompleteService.get(queryConf);
  }

  public autocompleListFormatter = (data: {name: Multiling, _id: string}) : SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this._domSanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };

  public autocompleValueFormatter = (data: {name: Multiling, _id: string}) : string => {
    return this._multiling.transform(data.name, this._translateService.currentLang);
  };

  public onClickSave() {
    switch (this._type) {

      case 'addTags':
        this.newTags.emit(this._tags);
        break;

      case 'editTag':
        this.updateTag.emit(this._tag);
        break;

      default:
        // do nothing...

    }

  }

  addTag(tag: any) {
    const id = tag.tag ? tag.tag : tag._id;

    this._tagsService.get(id).pipe(first()).subscribe((res: any) => {
      this._tags.push(res.tags[0]);
    });

  }


  connectToTag(event: Event, tag: Tag): void {
    event.preventDefault();

    this._tagsService.updateTagInPool(this._innovationId, tag).subscribe((data: Array<Tag>) => {
      const index = data.findIndex((item) => item._id === tag._id);
      if (index !== -1) {
        this._tag = data[index];
      }
      this._translateNotificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.UPDATED');
      this.needToSetOriginalTag = false;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ERROR');
    });

  }


  removeTag(tag: any) {
    this._tags.splice(this._tags.findIndex(value => value._id === tag._id), 1);
  }

  get tag(): Tag {
    return this._tag;
  }

  get tags(): Tag[] {
    return this._tags;
  }

  get type(): string {
    return this._type;
  }

  get innovationId(): string {
    return this._innovationId;
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get tagType(): string {
    return this._tagType;
  }

}
