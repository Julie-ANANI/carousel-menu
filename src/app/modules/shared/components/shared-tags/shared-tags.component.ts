import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { TagsService } from '../../../../services/tags/tags.service';
import { Tag } from '../../../../models/tag';
import { Observable } from 'rxjs';
import {LangEntryService} from '../../../../services/lang-entry/lang-entry.service';

type TagType = 'tags';

@Component({
  selector: 'app-shared-tags',
  templateUrl: './shared-tags.component.html',
  styleUrls: ['./shared-tags.component.scss']
})

export class SharedTagsComponent implements OnInit {

  @Input() isSmall = false; // true: to make the input field and add button size small.

  @Input() tags: Array<Tag> = [];

  @Input() type: TagType = null; // 'tags';

  @Input() projectId = '';

  @Input() editMode = false;

  @Input() placeholder = 'Add an existing tag here...';

  @Output() addTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  @Output() createTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  @Output() removeTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  private _tagForm: FormGroup;

  private _showModal = false;

  private _currentLang = this._translateService.currentLang;

  constructor(private _translateService: TranslateService,
              private _formBuilder: FormBuilder,
              private _langEntryService: LangEntryService,
              private _domSanitizer: DomSanitizer,
              private _tagsService: TagsService,
              private _autocompleteService: AutocompleteService) {
  }

  ngOnInit(): void {
    this._tagForm = this._formBuilder.group({
      tag: null,
    });
  }

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

  public autocompleListFormatter = (data: any): SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this._domSanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };

  public autocompleValueFormatter = (data: Tag): string => {
    return this._langEntryService.tagEntry(data, 'label', this._translateService.currentLang);
    // if (!this.projectId || this.type) {
    //   return this._langEntryService.transform(data, 'name', this._translateService.currentLang);
    // } else {
    //   return this._langEntryService.transform(data, 'label', this._translateService.currentLang);
    // }
  };

  public onSubmit() {
    if (typeof this._tagForm.get('tag').value !== 'string') {
      this.addTag.emit(this._tagForm.get('tag').value);
      this._tagForm.get('tag').reset();
    } else {
      this._showModal = true;
    }
  }

  public onRemoveTag(tag: Tag): void {
    this.removeTag.emit(tag);
  }

  public createNewTag(): void {
    const name = this._tagForm.get('tag').value;
    this._tagForm.get('tag').reset();

    if (typeof name === 'string') {
      const newTag = {
        entry: [
          {lang: 'en', 'label': name, 'description': ''},
          {lang: 'fr', 'label': name, 'description': ''},
        ]
      };
      this.createTag.emit(newTag);
    }

    this._showModal = false;
  }

  addNewTags(event: KeyboardEvent) {
    event.preventDefault();
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }

  addTagSelected(event: any) {
    if (typeof event === 'object') {
      if (typeof this._tagForm.get('tag').value !== 'string') {
        this.addTag.emit(this._tagForm.get('tag').value);
        this._tagForm.get('tag').reset();
      }
    }
  }

  closeCreatModal() {
    this._showModal = false;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get canAdd(): boolean {
    return !!this._tagForm.get('tag').value;
  }

  get tagForm(): FormGroup {
    return this._tagForm;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }
}
