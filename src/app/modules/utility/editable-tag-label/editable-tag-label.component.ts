import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
// import { MultilingPipe } from '../../../pipe/pipes/multiling.pipe';
import { TagsService } from '../../../services/tags/tags.service';
import { AutocompleteService } from '../../../services/autocomplete/autocomplete.service';
import { Tag } from '../../../models/tag';
import {LangEntryService} from '../../../services/lang-entry/lang-entry.service';

type TagType = 'tags';

/***
 * this is to show the banner on the top. In this, you can write any message or
 * add any html tag.
 *
 * Input:
 * 1. background: pass the value to change the background of the banner.
 * 2. showBanner: true to show banner
 * 3. position: default is absolute means it does not affect the space of the
 * parent container. You can also use other position css value.
 *
 * Implementation:
 * <app-utility-banner [(showBanner)]="value" [background]="'#EA5858'">
 *   <p>this is the message</p>
 * <app-utility-banner>
 *
 * Example:
 * app-admin-storyboard component.
 */

@Component({
  selector: 'app-utility-editable-tag-label',
  templateUrl: './editable-tag-label.component.html',
  styleUrls: ['./editable-tag-label.component.scss']
})

export class EditableTagLabelComponent implements OnInit, AfterViewInit {
  @Input() projectId = '';

  @Input() type: TagType = null; // 'tags';

  @Input() set defaultTag(value: Tag) {
    if (value) {
      this._defaultTag = value;
      this._originalTag = JSON.parse(JSON.stringify(value));
    } else {
      this._isEditable = true;
      // this._defaultTag = <Tag>{label: {en: '', fr: ''}};
      // this._originalTag = JSON.parse(JSON.stringify(<Tag>{label: {en: '', fr: ''}}));
      this._defaultTag = <Tag>{entry: [{lang: 'en', label: ''}, {lang: 'fr', label: ''}]};
      this._originalTag = JSON.parse(JSON.stringify(<Tag>{entry: [{lang: 'en', label: ''}, {lang: 'fr', label: ''}]}));
    }
  }

  @Output() performAction: EventEmitter<any> = new EventEmitter();

  private _isEditable = false;

  private _defaultTag: Tag;

  private _originalTag: Tag;

  private _showModal = false;

  private _currentLang = this._translateService.currentLang;

  constructor(private _translateService: TranslateService,
              private _langEntryService: LangEntryService,
              // private _multilingPipe: MultilingPipe,
              private _domSanitizer: DomSanitizer,
              private _tagsService: TagsService,
              private _autocompleteService: AutocompleteService) {
  }

  ngOnInit(): void {

  }


  /**
   *
   * @param query
   */
  public tagSuggestions(query: string): Observable<Array<any>> {
    if (this.projectId && !this.type) {
      return this._tagsService.searchTagInPool(this.projectId, query);
    } else {
      const queryConf: any = {query: query, type: 'tags'};
      if (this.type) {
        queryConf['tagType'] = this.type;
      }
      return this._autocompleteService.get(queryConf);
    }
  }

  public autocompleteListFormatter = (data: any): SafeHtml => {
    const text = this.autocompleteValueFormatter(data);
    return this._domSanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  }

  public autocompleteValueFormatter = (data: any): string => {
    return this._langEntryService.tagEntry(data, 'label', this._translateService.currentLang);
    /*if (!this.projectId || this.type) {
      return this._multilingPipe.transform(data.name, this._translateService.currentLang);
    } else {
      return this._multilingPipe.transform(data.label, this._translateService.currentLang);
    }*/
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this._showModal = true;
  }

  addNewTags(event: KeyboardEvent) {
    event.preventDefault();
    if (event.keyCode === 13) {
      this._showModal = true;
    }
  }

  deleteTag(event: Event) {
    event.preventDefault();
    this.performAction.emit({action: 'delete', value: this._defaultTag});
  }

  get label(): string {
    return this._langEntryService.transform(this.defaultTag.entry, 'label', this.currentLang, false);
  }

  onEdit(event: Event) {
    event.preventDefault();
    this._isEditable = true;
  }

  valueOnChange(value: any) {
    if (typeof value === 'object') {
      this._defaultTag = JSON.parse(JSON.stringify(value));
      this.performAction.emit({action: 'add', value: this._defaultTag});
      this._isEditable = false;
    } else {
      // this._defaultTag.label[this.currentLang] = value;
      const _index = LangEntryService.entryIndex(this._defaultTag.entry, 'lang', this.currentLang);
      if (_index !== -1) {
        this._defaultTag.entry[_index].label = value;
      }
    }
  }

  createNewTag() {
    this._isEditable = false;
    this.performAction.emit({action: 'create', value: this._defaultTag});
  }

  onCancel(event: Event) {
    event.preventDefault();
    this._defaultTag = JSON.parse(JSON.stringify(this._originalTag));
    this._isEditable = false;
    this.performAction.emit({action: 'cancel', value: this._defaultTag});
  }

  ngAfterViewInit() {
    if (document && document.getElementById('editable-tag-label-input')) {
      setTimeout(() => {
        document.getElementById('editable-tag-label-input').focus();
      });
    }
  }

  get defaultTag(): Tag {
    return this._defaultTag;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  get currentLang(): string {
    return this._currentLang;
  }

}
