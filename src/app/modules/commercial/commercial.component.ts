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
  private _selectedTagsStats: Array<TagStats> = [];
  public tagForm: FormGroup;

  private _countries: Array<string> = [];
  private _stats: TagStats;

  constructor(private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private tagService: TagsService,
              private translateNotificationService: TranslateNotificationsService,
              private translateService: TranslateService) {
    this._stats = this.computeStats();
  }

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

  private computeStats(): TagStats {
    const countriesCount = this._selectedTagsStats.reduce((acc, stats) => {
      stats.geographicalRepartition.forEach((cc) => {
        if (acc[cc.country]) {
          acc[cc.country] += cc.count;
        } else {
          acc[cc.country] = cc.count;
        }
      });
      return acc;
    }, {});
    const geographicalRepartition = Object.keys(countriesCount).map((c) => {
      return {country: c, count: countriesCount[c]};
    });
    this._countries = geographicalRepartition.map((o) => o.country);
    return this._selectedTagsStats.reduce((acc, stats) => {
      acc.totalInnovations = acc.totalInnovations + stats.totalInnovations;
      acc.totalAnswers = acc.totalAnswers + stats.totalAnswers;
      acc.countNeed = acc.countNeed + stats.countNeed;
      acc.totalCountNeed = acc.totalCountNeed + stats.totalCountNeed;
      acc.countDiff = acc.countDiff + stats.countDiff;
      acc.totalCountDiff = acc.totalCountDiff + stats.totalCountDiff;
      acc.countLeads = acc.countLeads + stats.countLeads;
      return acc;
    }, {
      totalInnovations: 0,
      totalAnswers: 0,
      countNeed: 0,
      totalCountNeed: 0,
      countDiff: 0,
      totalCountDiff: 0,
      countLeads: 0,
      geographicalRepartition: geographicalRepartition
    });
  }

  public selectTag() {
    const selectedTagId = this.tagForm.get('selectedTag').value;
    const selectedTag = this._sectorTags.find((t) => t._id === selectedTagId);
    if (selectedTag && this._selectedTagsStats.findIndex((t) => t.tag._id === selectedTagId) === -1) {
      this.tagService.getStats(selectedTag._id).subscribe(stats => {
        this._selectedTagsStats.push(stats);
        this._stats = this.computeStats();
      }, err => {
        this.translateNotificationService.error('ERROR.ERROR', err);
      });
    }
  }

  public removeStat(event: Event, tagId: string) {
    event.preventDefault();
    this._selectedTagsStats = this._selectedTagsStats.filter((t) => t.tag._id !== tagId);
    this._stats = this.computeStats();
  }

  get countries() {
    return this._countries;
  }

  get lang(): string { return this.translateService.currentLang; }

  get sectorTags(): Array<Tag> {
    return this._sectorTags;
  }

  get selectedTagsStats(): Array<TagStats> {
    return this._selectedTagsStats;
  }

  get stats(): TagStats {
    return this._stats;
  }

}
