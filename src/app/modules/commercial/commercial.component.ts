import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../services/notifications/notifications.service';
import { TagsService } from '../../services/tags/tags.service';
import { Tag } from '../../models/tag';
import { TagStats } from '../../models/tag-stats';

@Component({
  selector: 'app-commercial',
  templateUrl: './commercial.component.html',
  // styleUrls: ['./commercial.component.scss']
})

export class CommercialComponent implements OnInit {

  private _sectorTags: Array<Tag> = [];
  private _selectedTags: Array<Tag> = [];
  public tagForm: FormGroup;

  private _stats: TagStats;

  constructor(private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private tagService: TagsService,
              private translateNotificationService: TranslateNotificationsService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.tagForm = this.formBuilder.group({
      selectedTag: ['', Validators.required],
    });
    if (Array.isArray(this.activatedRoute.snapshot.data['tags'])) {
      this._sectorTags = this.activatedRoute.snapshot.data['tags'];
      if (this._sectorTags.length > 0) {
        this.tagForm.setValue({selectedTag: this._sectorTags[0]._id});
      }
    }
  }

  public selectTag() {
    const selectedTagId = this.tagForm.get('selectedTag').value;
    const selectedTag = this._sectorTags.find((t) => t._id === selectedTagId);
    if (selectedTag && this._selectedTags.findIndex((t) => t === selectedTag) === -1) {
      this._selectedTags.push(selectedTag);
      this.tagService.getStats(selectedTag._id).subscribe((stats) => {
        console.log(stats);
      }, (err) => {
        this.translateNotificationService.error('ERROR.ERROR', err);
      });
    }
  }

  public removeTag(event: Event, tag: Tag) {
    event.preventDefault();
    this._selectedTags = this._selectedTags.filter((t) => t !== tag);
  }

  get lang(): string { return this.translateService.currentLang; }

  get sectorTags(): Array<Tag> {
    return this._sectorTags;
  }

  get selectedTags(): Array<Tag> {
    return this._selectedTags;
  }

  get stats(): TagStats {
    return this._stats;
  }

}
