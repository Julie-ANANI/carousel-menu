import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AutocompleteService } from '../../../../services/autocomplete/autocomplete.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { TagsService } from '../../../../services/tags/tags.service';
import { MultilingPipe } from '../../../../pipe/pipes/multiling.pipe';
import { Tag } from '../../../../models/tag';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-shared-tag-item',
  templateUrl: './shared-tag-item.component.html',
  styleUrls: ['./shared-tag-item.component.scss']
})

export class SharedTagItemComponent implements OnInit {

  @Input() tags: Array<any>;
  @Input() set projectId(project: string) {
    this._projectId = project;
  };
  @Input() editMode: boolean;

  @Output() addTag: EventEmitter<Tag> = new EventEmitter();
  @Output() removeTag: EventEmitter<Tag> = new EventEmitter();

  private _tagForm: FormGroup;

  private _projectId = '';

  constructor(private translateService: TranslateService,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private tagsService: TagsService,
              private modalService: ModalService,
              private autocompleteService: AutocompleteService) {}

  ngOnInit() {
    this._tagForm = this.formBuilder.group({
      tag: null,
    });
  }

  public tagSuggestions(keyword: string): Observable<Array<any>> {
    if (this._projectId !== '') {
      return this.tagsService.searchTagInPool(this.projectId, keyword);
    } else {
      const queryConf = {
        keyword: keyword,
        type: 'tags'
      };
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
      this.modalService.open('confirm-tag-creation-modal');
    }
  }

  public closeModal(event: Event, id: string): void {
    event.preventDefault();
    this.modalService.close(id);
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

  get projectId(): string{
    return this._projectId;
  }

}
