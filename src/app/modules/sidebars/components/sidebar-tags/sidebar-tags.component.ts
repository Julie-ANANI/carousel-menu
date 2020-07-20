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
  selector: 'app-sidebar-tags',
  templateUrl: './sidebar-tags.component.html',
  styleUrls: ['./sidebar-tags.component.scss']
})

export class SidebarTagsComponent {

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this._tags = [];
    } else {
      this.needToSetOriginalTag = false;
      this.saveButton(false);
    }
  }

  @Input() set tags(tags: Array<Tag>) {
    this._tags = [...tags];
  }

  /***
   * this value is when you want to update the
   * existing tag.
   * @param tag
   */
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

  @Input() set placeholder(value: string) {
    this._placeholder = value;
  }

  @Output() newTags: EventEmitter<Array<Tag>> = new EventEmitter<Array<Tag>>();

  @Output() updateTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  private _tags: Array<Tag> = [];

  private _tag: Tag;

  private _innovationId: string;

  private _type: string;

  public needToSetOriginalTag = false;

  private _tagType: string;

  private _placeholder: string = 'COMMON.TAG.TAG_PLACEHOLDER';

  private _enableSaveButton: boolean;

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

  public onAddTag(value: any) {
    const id = value.tag ? value.tag : value._id;

    this._tagsService.get(id).pipe(first()).subscribe((res: any) => {
      this._tags.push(res.tags[0]);
      this.saveButton(true);
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.TAG_FETCHING_ERROR');
    });

  }

  public onRemoveTag(tag: any) {
    this._tags.splice(this._tags.findIndex(value => value._id === tag._id), 1);
    if (this._tags.length !== 0) {
      this.saveButton(true);
    } else {
      this.saveButton(false);
    }
  }

  public onCreateTag(value: Tag) {
    this._tagsService.create(value).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.CREATED');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.TAG_FETCHING_ERROR');
    });
  }

  public onClickSave() {

    switch (this._type) {

      case 'addTags':
        this.newTags.emit(this._tags);
        break;

      case 'editTag':
        this.updateTag.emit(this._tag);
        this.saveButton(true);
        break;

    }

  }

  public saveButton(value: boolean) {
    this._enableSaveButton = value;
  }

  public connectToTag(tag: Tag) {
    this._tagsService.updateTagInPool(this._innovationId, tag).pipe(first()).subscribe((data: Array<Tag>) => {
      const index = data.findIndex((item) => item._id === tag._id);
      if (index !== -1) {
        this._tag = data[index];
      }
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.UPDATED');
      this.needToSetOriginalTag = false;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  get tag(): Tag {
    return this._tag;
  }

  get tags(): Array<Tag> {
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

  get placeholder(): string {
    return this._placeholder;
  }

  get enableSaveButton(): boolean {
    return this._enableSaveButton;
  }

}
