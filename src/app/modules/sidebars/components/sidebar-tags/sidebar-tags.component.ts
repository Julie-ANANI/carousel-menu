import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { TagsService } from '../../../../services/tags/tags.service';
import { Tag } from '../../../../models/tag';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorFrontService } from "../../../../services/error/error-front.service";
import {LangEntryService} from '../../../../services/lang-entry/lang-entry.service';

type Template = 'ADD_TAGS' | 'EDIT_TAG' | '';
type TagType = 'tags' | '';

@Component({
  selector: 'app-sidebar-tags',
  templateUrl: './sidebar-tags.component.html',
  styleUrls: ['./sidebar-tags.component.scss']
})

export class SidebarTagsComponent {

  @Input() isEditable = false;

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this._tags = [];
    } else {
      this._needToSetOriginalTag = false;
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
    if (tag && tag._id) {
      this._tag = {...tag};
      this._needToSetOriginalTag = !(tag.originalTagId);
    }
  }

  @Input() placeholder = 'Add an existing tag here...';

  @Input() projectId = '';

  @Input() type: Template = '';

  @Input() tagType: TagType = '';

  @Output() newTags: EventEmitter<Array<Tag>> = new EventEmitter<Array<Tag>>();

  @Output() updateTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  private _tags: Array<Tag> = [];

  private _tag: Tag = <Tag>{};

  private _needToSetOriginalTag = false;

  private _enableSaveButton = false;

  constructor(private _tagsService: TagsService,
              private _autocompleteService: AutocompleteService,
              private _langEntryService: LangEntryService,
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

  public autocompleListFormatter = (data: {name: any, _id: string}) : SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this._domSanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };

  public autocompleValueFormatter = (data: Tag) : string => {
    return this._langEntryService.tagEntry(data, 'label', this._translateService.currentLang);
    // return this._multiling.transform(data.name, this._translateService.currentLang);
  };

  public onAddTag(value: any) {
    const _id = value.tag ? value.tag : value._id;
    this._tagsService.get(_id).pipe(first()).subscribe((res: any) => {
      this._tags.push(res && res.tags && res.tags.length && res.tags[0]);
      this.saveButton(true);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
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
      this._translateNotificationsService.success('Success' , 'The tag is created.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public updateTagEntry(value: string, attr: 'label' | 'description', lang: string) {
    const _index = LangEntryService.entryIndex(this._tag.entry, 'lang', lang);
    if (_index !== -1) {
      this._tag.entry[_index][attr] = value.trim();
      this.saveButton(true);
    }
  }


  public onClickSave() {
    if (this.isEditable) {
      switch (this.type) {

        case 'ADD_TAGS':
          this.newTags.emit(this._tags);
          break;

        case 'EDIT_TAG':
          this.updateTag.emit(this._tag);
          this.saveButton(true);
          break;

      }
    }
  }

  public saveButton(value: boolean) {
    if (this.isEditable) {
      this._enableSaveButton = value;
    }
  }

  public connectToTag(tag: Tag) {
    this._tagsService.updateTagInPool(this.projectId, tag).pipe(first()).subscribe((data: Array<Tag>) => {
      const index = data.findIndex((item) => item._id === tag._id);
      if (index !== -1) {
        this._tag = data[index];
      }
      this._translateNotificationsService.success('Success' , 'The tag is updated.');
      this._needToSetOriginalTag = false;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  get tag(): Tag {
    return this._tag;
  }

  get tags(): Array<Tag> {
    return this._tags;
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get enableSaveButton(): boolean {
    return this._enableSaveButton;
  }

  get needToSetOriginalTag(): boolean {
    return this._needToSetOriginalTag;
  }

  set needToSetOriginalTag(value: boolean) {
    this._needToSetOriginalTag = value;
  }

}
