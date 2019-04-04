import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../services/notifications/notifications.service';
import { TagsService } from '../../services/tags/tags.service';
import { Tag } from '../../models/tag';
import { TagStats } from '../../models/tag-stats';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
})

export class ShowcaseComponent implements OnInit {

  private _sectorTags: Array<Tag> = [];
  private _selectedTagsStats: Array<TagStats> = [];
  public tagForm: FormGroup;
  public openSectorsModal = false;

  private _countries: {[country: string]: number} = {};
  private _countriesCount = 0;
  private _stats: TagStats = {};

  private _maxFirstTertile = 0;
  private _maxSecondTertile = 0;

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
    this.recomputeData();
  }

  private computeCountries(): void {
    this._countries = this._selectedTagsStats.reduce((acc, stats) => {
      stats.geographicalRepartition.forEach((cc) => {
        if (acc[cc.country]) {
          acc[cc.country] += cc.count;
        } else {
          acc[cc.country] = cc.count;
        }
      });
      return acc;
    }, <{[country: string]: number}>{});
    const countriesList = Object.keys(this._countries);
    this._countriesCount = countriesList.length;
    const orderedCountries = countriesList.sort((a, b) => this._countries[a] - this._countries[b]);
    const tertileSize = (orderedCountries.length / 3);
    this._maxFirstTertile = this._countries[orderedCountries[Math.floor(tertileSize)]];
    this._maxSecondTertile = this._countries[orderedCountries[Math.floor(2 * tertileSize)]];
  }

  private computeStats(): void {
    this._stats = this._selectedTagsStats.reduce((acc, stats) => {
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
      geographicalRepartition: [] // we don't need this here, we already have _countries
    });
  }

  private recomputeData(): void {
    this.computeStats();
    this.computeCountries();
  }

  public selectTag() {
    const selectedTagId = this.tagForm.get('selectedTag').value;
    const selectedTag = this._sectorTags.find((t) => t._id === selectedTagId);
    if (selectedTag && this._selectedTagsStats.findIndex((t) => t.tag._id === selectedTagId) === -1) {
      this.tagService.getStats(selectedTag._id).subscribe(stats => {
        this._selectedTagsStats = this._selectedTagsStats.concat(stats);
        this.recomputeData();
      }, err => {
        this.translateNotificationService.error('ERROR.ERROR', err);
      });
    }
  }

  public removeStat(event: Event, tagId: string) {
    event.preventDefault();
    this._selectedTagsStats = this._selectedTagsStats.filter((t) => t.tag._id !== tagId);
    this.recomputeData();
  }

  get countries() {
    return this._countries;
  }

  get countriesCount() {
    return this._countriesCount;
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

  get maxFirstTertile() {
    return this._maxFirstTertile;
  }

  get maxSecondTertile() {
    return this._maxSecondTertile;
  }

}
