import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MultilingPipe } from '../../../pipe/pipes/multiling.pipe';
import { TagsService } from '../../../services/tags/tags.service';
import { AutocompleteService } from '../../../services/autocomplete/autocomplete.service';

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

export class EditableTagLabelComponent implements OnInit {
  @Input() projectId = '';

  @Input() type: TagType = null; // 'tags';

  @Input() set defaultTag(value: string) {
    this._defaultTag = value;
    this._originalTag = value;
  }

  @Output() performAction: EventEmitter<any> = new EventEmitter();

  private _isEditable = false;

  private _defaultTag = '';

  private _originalTag = '';

  constructor(private _translateService: TranslateService,
              private _multilingPipe: MultilingPipe,
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
    if (!this.projectId || this.type) {
      return this._multilingPipe.transform(data.name, this._translateService.currentLang);
    } else {
      return this._multilingPipe.transform(data.label, this._translateService.currentLang);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this._isEditable = false;
    this.performAction.emit({action: 'add', value: this._defaultTag});
  }

  addNewTags(event: KeyboardEvent) {
    event.preventDefault();
    if (event.keyCode === 13) {
      this._isEditable = false;
      this.performAction.emit({action: 'add', value: this._defaultTag});
    }
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  valueOnChange(value: any) {
    this._defaultTag = value;
  }

  get defaultTag(): string {
    return this._defaultTag;
  }

  focusOut() {
    this._defaultTag = this._originalTag;
    this._isEditable = false;
    this.performAction.emit({action: 'add', value: this._defaultTag});
  }

  deleteTag(event: Event) {
    event.preventDefault();
    this.performAction.emit({action: 'delete', value: this._defaultTag});
  }

  onEdit(event: Event) {
    event.preventDefault();
    this._isEditable = true;
  }
}
