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
  selector: 'app-tags-form',
  templateUrl: './tags-form.component.html',
  styleUrls: ['./tags-form.component.scss']
})

export class TagsFormComponent {

  @Input() set tags(tags: Array<Tag>) {
    this._tags = [...tags];
  }

  @Input() set tag(tag: Tag) {
    this._tag = {...tag};
    this._needToSetOriginalTag = !(tag.originalTagId);
  }

  @Input() set project(value: Innovation) {
    this._innovationId = value._id;
  }

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this._tags = [];
    }
  }

  @Input() set type(type: string) {
    this._type = type;
  }

  @Input() tagType: string;

  @Output() newTags = new EventEmitter<Tag[]>();

  @Output() updateTag = new EventEmitter<Tag>();

  private _tags: Tag[] = [];

  private _tag: Tag;

  private _innovationId = '';

  private _type = '';

  private _needToSetOriginalTag = false;

  constructor(private tagsService: TagsService,
              private autocompleteService: AutocompleteService,
              private translateNotificationsService: TranslateNotificationsService,
              private translateService: TranslateService,
              private domSanitizer: DomSanitizer) { }


  onClickSave() {
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


  suggestions(query: string): Observable<Array<any>> {
    const queryConf = {
      query: query,
      type: 'tags'
    };
    return this.autocompleteService.get(queryConf);
  }


  autocompleListFormatter = (data: {name: Multiling, _id: string}) : SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this.domSanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };


  autocompleValueFormatter = (data: {name: Multiling, _id: string}) : string => {
    return MultilingPipe.prototype.transform(data.name, this.translateService.currentLang);
  };


  addTag(tag: any) {
    const id = tag.tag ? tag.tag : tag._id;

    this.tagsService.get(id).pipe(first()).subscribe((res: any) => {
      this._tags.push(res.tags[0]);
    });

  }


  connectToTag(event: Event, tag: Tag): void {
    event.preventDefault();

    this.tagsService.updateTagInPool(this._innovationId, tag).pipe(first()).subscribe((data: any) => {
      const index = data.findIndex((item) => item._id === tag._id);
      if (index !== -1) {
        this._tag = data[index];
      }
      this.translateNotificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.UPDATED');
      this._needToSetOriginalTag = false;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ASSOCIATED');
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

  get needToSetOriginalTag(): boolean {
    return this._needToSetOriginalTag;
  }

  get lang(): string {
    return this.translateService.currentLang;
  }

}
