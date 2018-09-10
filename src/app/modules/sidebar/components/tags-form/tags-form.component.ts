import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import {TagsService} from '../../../../services/tags/tags.service';
import {Subject} from 'rxjs/Subject';
import {Tag} from '../../../../models/tag';
import { Innovation } from '../../../../models/innovation';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { MultilingPipe } from '../../../../pipe/pipes/multiling.pipe';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-tags-form',
  templateUrl: './tags-form.component.html',
  styleUrls: ['./tags-form.component.scss']
})
export class TagsFormComponent implements OnInit {

  @Input() set type(type: string) {
    this._type = type;
  }

  @Input() set tags(tags: Array<Tag>) {
    this._tags = [...tags];
  }

  @Input() set tag(tag: Tag) {
    this._tag = {...tag};
    this._needToSetOriginalTag = !(tag.originalTagId);
  }

  @Input() set project(value: Innovation) {
    this._projectId = value._id;
  }

  @Input() sidebarState: Subject<string>;

  @Output() newTags = new EventEmitter<Tag[]>();
  @Output() updateTag = new EventEmitter<Tag>();

  private _tags: Tag[] = [];
  private _tag: Tag;
  private _projectId = '';

  private _type = '';

  private _needToSetOriginalTag = false;

  constructor(private _tagsService: TagsService,
              private _autocompleteService: AutocompleteService,
              private _notificationsService: TranslateNotificationsService,
              private _translateService: TranslateService,
              private _sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.sidebarState) {
      this.sidebarState.subscribe((state) => {
        if (state === 'inactive') {
          setTimeout (() => {
            this._tags = [];
          }, 500);
        }
      })
    }
  }


  onSubmit() {
    switch (this._type) {
      case 'addTags':
        this.newTags.emit(this._tags);
        break;
      case 'editTag':
        this.updateTag.emit(this._tag);
        break;
    }
  }

  public suggestions(keyword: string): Observable<Array<any>> {
    const queryConf = {
      keyword: keyword,
      type: 'tags'
    };
    return this._autocompleteService.get(queryConf);
  }

  public autocompleListFormatter = (data: {name: string, _id: string}) : SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this._sanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };

  public autocompleValueFormatter = (data: {name: string, _id: string}) : string => {
    return MultilingPipe.prototype.transform(data.name, this._translateService.currentLang);
  };

  addTag(tag: any) {
    const id = tag.tag ? tag.tag : tag._id;
    this._tagsService.get(id).first().subscribe(res => {
      this._tags.push(res.tags[0]);
    });
  }

  public connectToTag(event: Event, tag: Tag): void {
    event.preventDefault();
    this._tagsService
      .updateTagInPool(this._projectId, tag)
      .first()
      .subscribe((data) => {
        this._needToSetOriginalTag = false;
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.UPDATED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
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

  get projectId(): string {
    return this._projectId;
  }

  get needToSetOriginalTag(): boolean {
    return this._needToSetOriginalTag;
  }
}
