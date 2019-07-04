import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { TagsService } from '../../../../services/tags/tags.service';
import { MultilingPipe } from '../../../../pipe/pipes/multiling.pipe';
import { Tag } from '../../../../models/tag';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shared-tag',
  templateUrl: './shared-tag.component.html',
  styleUrls: ['./shared-tag.component.scss']
})

export class SharedTagComponent implements OnInit {

  @Input() set tags(value: Array<Tag>) {
    this._tags = value;
  }

  @Input() set type(value: string){
    this._type = value;
  }

  @Input() set projectId(project: string) {
    this._projectId = project;
  };

  @Input() set editMode(value: boolean) {
    this._editMode = value;
  }

  @Input() set isAdmin(value: boolean) {
    this._isAdmin = value;
  }

  @Input() set placeholder(value: string) {
    this._placeholder = value;
  }

  @Output() addTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  @Output() createTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  @Output() removeTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  private _tagForm: FormGroup;

  private _showModal: boolean;

  private _projectId: string;

  private _placeholder: string = 'COMMON.TAG.TAG_PLACEHOLDER';

  private _type: string;

  private _editMode: boolean;

  private _tags: Array<Tag> = [];

  private _isAdmin: boolean;

  constructor(private _translateService: TranslateService,
              private _formBuilder: FormBuilder,
              private _multilingPipe: MultilingPipe,
              private _domSanitizer: DomSanitizer,
              private _tagsService: TagsService,
              private _autocompleteService: AutocompleteService) {}

  ngOnInit() {
    this._tagForm = this._formBuilder.group({
      tag: null,
    });
  }

  public tagSuggestions(query: string): Observable<Array<any>> {

    if (this._projectId && !this._type) {
      return this._tagsService.searchTagInPool(this._projectId, query);
    } else {

      const queryConf: any = { query: query, type: 'tags' };

      if (this._type) {
        queryConf.type = this._type;
      }

      return this._autocompleteService.get(queryConf);
    }

  }

  public autocompleListFormatter = (data: any): SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this._domSanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };

  public autocompleValueFormatter = (data: any) : string => {
    if (!this._projectId || this._type) {
      return this._multilingPipe.transform(data.name, this._translateService.currentLang);
    } else {
      return this._multilingPipe.transform(data.label, this._translateService.currentLang);
    }
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
      this.createTag.emit({ label: { en: name, fr: name }, description: { en: '', fr: ''} });
    }

    this._showModal = false;

  }

  get userLang(): string {
    return this._translateService.currentLang || 'en';
  }

  get canAdd(): boolean {
    return !!this._tagForm.get('tag').value;
  }

  get tagForm(): FormGroup {
    return this._tagForm;
  }

  get projectId(): string {
    return this._projectId;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get placeholder(): string {
    return this._placeholder;
  }

  get type(): string {
    return this._type;
  }

  get editMode(): boolean {
    return this._editMode;
  }

  get tags(): Array<Tag> {
    return this._tags;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

}
