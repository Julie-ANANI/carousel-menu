import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AutocompleteService } from '../../../../../services/autocomplete/autocomplete.service';
import { TagsService } from '../../../../../services/tags/tags.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Tag } from '../../../../../models/tag';
import { Observable } from 'rxjs/Observable';
import { MultilingPipe } from '../../../../../pipe/pipes/multiling.pipe';

@Component({
  selector: 'app-admin-project-tags-pool',
  templateUrl: 'admin-project-tags-pool.component.html',
  styleUrls: ['admin-project-tags-pool.component.scss']
})
export class AdminProjectTagsPoolComponent implements OnInit {

  private _projectId: string;
  private _tags: Array<Tag>;
  private _tagForm: FormGroup;

  public editDatum = {};
  private _config = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      label: -1
    }
  };

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private translateService: TranslateService,
              private autocompleteService: AutocompleteService,
              private notificationsService: TranslateNotificationsService,
              private tagService: TagsService) {}

  ngOnInit(): void {
    this._projectId = this.route.snapshot.parent.data['innovation']._id;
    this._tagForm = this.formBuilder.group({
      tag: null,
    });
    this.tagService.getTagsFromPool(this._projectId).subscribe((data) => {
      this._tags = data;
    });
  }

  public suggestions(keyword: string): Observable<Array<any>> {
    const queryConf = {
      keyword: keyword,
      type: 'tags'
    };
    return this.autocompleteService.get(queryConf);
  }

  public autocompleListFormatter = (data: {name: string, _id: string}) : SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this.sanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };

  public autocompleValueFormatter = (data: {name: string, _id: string}) : string => {
      return MultilingPipe.prototype.transform(data.name, this.translateService.currentLang);
  };

  public addTag(event: Event): void {
    event.preventDefault();
    this.tagService
      .addTagToPool(this._projectId, this._tagForm.get('tag').value._id)
      .first()
      .subscribe((data) => {
        this._tags = data;
        this.notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, err => {
        this.notificationsService.error('ERROR.ERROR', err);
      });
    this._tagForm.get('tag').reset();
  }

  public updateTag(event: Event, tag: Tag): void {
    event.preventDefault();
    this.tagService
      .updateTagInPool(this._projectId, tag)
      .first()
      .subscribe((data) => {
        this.editDatum[tag._id] = false;
        this.notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.UPDATED');
      }, err => {
        this.notificationsService.error('ERROR.ERROR', err);
      });
  }

  public removeTag(event: Event, tag: Tag): void {
    event.preventDefault();
    this.tagService
      .removeTagFromPool(this._projectId, tag._id)
      .first()
      .subscribe((data) => {
        this._tags = data;
        this.notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
      }, err => {
        this.notificationsService.error('ERROR.ERROR', err);
      });
  }

  get config() { return this._config; }
  get tagForm() { return this._tagForm; }
  get tags() { return this._tags; }
}
