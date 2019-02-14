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
  selector: 'app-shared-tag-item',
  templateUrl: './shared-tag-item.component.html',
  styleUrls: ['./shared-tag-item.component.scss']
})

export class SharedTagItemComponent implements OnInit {

  @Input() tags: Array<any>;

  @Input() type: string;

  @Input() set projectId(project: string) {
    this._projectId = project;
  };

  @Input() editMode: boolean;

  @Input() isAdmin: boolean;

  @Input() backgroundColor: string;

  @Input() textColor: string;

  @Output() addTag: EventEmitter<Tag> = new EventEmitter();

  @Output() createTag: EventEmitter<Tag> = new EventEmitter();

  @Output() removeTag: EventEmitter<Tag> = new EventEmitter();

  private _tagForm: FormGroup;

  private _showModal = false;

  private _projectId = '';

  constructor(private translateService: TranslateService,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private tagsService: TagsService,
              private autocompleteService: AutocompleteService) {}

  ngOnInit() {
    this._tagForm = this.formBuilder.group({
      tag: null,
    });
  }

  public tagSuggestions(query: string): Observable<Array<any>> {
    if (this._projectId !== '') {
      return this.tagsService.searchTagInPool(this.projectId, query);
    } else {
      const queryConf = {
        query: query,
        type: 'tags'
      };
      if (this.type) {
        queryConf['tagType'] = this.type;
      }
      return this.autocompleteService.get(queryConf);
    }
  }

  public autocompleListFormatter = (data: any) : SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this.sanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };

  public autocompleValueFormatter = (data: any) : string => {
    if (this._projectId === '') {
      return MultilingPipe.prototype.transform(data.name, this.translateService.currentLang);
    } else {
      return MultilingPipe.prototype.transform(data.label, this.translateService.currentLang);
    }
  };

  public addTagEmitter(event: Event): void {
    event.preventDefault();
    if (typeof this._tagForm.get('tag').value !== 'string') {
      this.addTag.emit(this._tagForm.get('tag').value);
      this._tagForm.get('tag').reset();
    } else {
      this._showModal = true;
    }
  }

  public createNewTag(): void {
    const name = this._tagForm.get('tag').value;
    this._tagForm.get('tag').reset();
    if (typeof name === 'string') {
      this.createTag.emit({
        label: { en: name, fr: name },
        description: { en: '', fr: ''}
      });
    }
    this._showModal = false;
  }

  public removeTagEmitter(event: Event, tag: Tag): void {
    event.preventDefault();
    this.removeTag.emit(tag);
  }

  get canAdd(): boolean {
    return !!this._tagForm.get('tag').value;
  }

  get tagForm() {
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

}
