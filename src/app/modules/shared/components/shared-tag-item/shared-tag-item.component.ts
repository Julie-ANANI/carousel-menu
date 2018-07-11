import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { TagsService } from '../../../../services/tags/tags.service';
import { MultilingPipe } from '../../../../pipes/multiling/multiling.pipe';
import { Tag } from '../../../../models/tag';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-shared-tag-item',
  templateUrl: './shared-tag-item.component.html',
  styleUrls: ['./shared-tag-item.component.scss']
})

export class SharedTagItemComponent implements OnInit {

  @Input() tags: Array<Tag>;
  @Input() projectId: string;
  @Input() editMode: boolean;

  @Output() addTag: EventEmitter<Tag> = new EventEmitter();
  @Output() removeTag: EventEmitter<Tag> = new EventEmitter();

  private _tagForm: FormGroup;

  constructor(private translateService: TranslateService,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private tagsService: TagsService) {}

  ngOnInit() {
    this._tagForm = this.formBuilder.group({
      tag: [''],
    });
  }

  public tagSuggestions(keyword: string): Observable<Array<any>> {
    return this.tagsService.searchTagInPool(this.projectId, keyword);
  }

  public autocompleListFormatter = (data: Tag) : SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this.sanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };

  public autocompleValueFormatter = (data: Tag) : string => {
    return MultilingPipe.prototype.transform(data.label, this.translateService.currentLang);
  };

  public addTagEmitter(event: Event): void {
    event.preventDefault();
    this.addTag.emit(this._tagForm.get('tag').value);
    this._tagForm.get('tag').reset();
  }

  public removeTagEmitter(event: Event, tag: Tag): void {
    event.preventDefault();
    this.removeTag.emit(tag);
  }

  get canAdd(): boolean {
    return (this._tagForm.get('tag').value && typeof this._tagForm.get('tag').value !== 'string');
  }

  get tagForm() {
    return this._tagForm;
  }

}
