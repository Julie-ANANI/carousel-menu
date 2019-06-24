import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MultilingPipe } from '../../../../pipe/pipes/multiling.pipe';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TagsService } from '../../../../services/tags/tags.service';
import { Tag } from '../../../../models/tag';
import { TagStats } from '../../../../models/tag-stats';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})

export class ShowcaseComponent {

  private readonly _sectorTags: Array<Tag>;

  private _selectedTagsStats: Array<TagStats>;

  private _selectedTags: {[tagId: string]: boolean} = {};

  private _countries: {readonly [country: string]: number} = {};

  private _countriesCount = 0;

  private _stats: TagStats = {};

  private _quartiles = [1, 1, 1];

  private _modalShow: boolean = false;

  private _loadingStats = false;

  constructor(private _activatedRoute: ActivatedRoute,
              private _multilingPipe: MultilingPipe,
              private _tagService: TagsService,
              private _translateService: TranslateService,
              private _translateNotificationService: TranslateNotificationsService) {

    if (Array.isArray(this._activatedRoute.snapshot.data['tags'])) {
      this._sectorTags = this._activatedRoute.snapshot.data['tags'].sort((t1: Tag, t2: Tag) => {
        const label1 = this._multilingPipe.transform(t1.label, this._translateService.currentLang);
        const label2 = this._multilingPipe.transform(t2.label, this._translateService.currentLang);
        return label1.localeCompare(label2);
      });
    } else {
      this._translateNotificationService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    }

    const tagStats = this._activatedRoute.snapshot.data['tagsStats'];
    if (Array.isArray(tagStats)) {
      this._selectedTagsStats = tagStats;
      this._recomputeData();
    } else {
      this._selectedTagsStats = [];
      this._translateNotificationService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    }

  }

  public modifyTag() {
    this._modalShow = true;
  }


  public onChangeTag(event: Event, tag: Tag) {
    event.preventDefault();
    this._selectedTags[tag._id] = (event.target as HTMLInputElement).checked;
  }


  public onClickApply(event: Event): void {
    event.preventDefault();
    this._modalShow = false;

    const tagsStatsObservables =
      Object
        .keys(this._selectedTags)
        .filter((tagId) => this._selectedTags[tagId])
        .map((tagId) => this._tagService.getStats(tagId));

    if (tagsStatsObservables.length > 0) {
      this._loadingStats = true;
      forkJoin(tagsStatsObservables)
        .pipe(finalize(() => { this._loadingStats = false; }))
        .subscribe((res) => {
          this._selectedTagsStats = res;
          this._recomputeData();
        }, () => {
          this._translateNotificationService.error('ERROR.ERROR', `We are having trouble while finding the stats.`);
        });
    }
  }


  private _recomputeData() {
    this._computeStats();
    this._computeCountries();
  }


  private _computeStats() {
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
    console.log('--------------------------------');
    console.log(`Answers/Inno: ${Math.round(this._stats.totalAnswers / this._stats.totalInnovations)}`);
    console.log(`Need: ${this._stats.countNeed}/${this._stats.totalCountNeed}`);
    console.log(`Diff: ${this._stats.countDiff}/${this._stats.totalCountDiff}`);
    console.log(`Leads: ${this._stats.countLeads}`);
  }


  private _computeCountries() {
    this._countries = this._selectedTagsStats.reduce( (acc, stats) => {
      stats.geographicalRepartition.forEach((cc) => {
        if (acc[cc.country]) {
          acc[cc.country] += cc.count;
        } else {
          acc[cc.country] = cc.count;
        }
      });
      return acc;
    }, <{ [country: string]: number }> {} );

    const countriesList = Object.keys(this._countries);

    this._countriesCount = countriesList.length;

    const orderedCountries = countriesList.sort((a, b) => this._countries[a] - this._countries[b]);

    const tertileSize = (orderedCountries.length / 3);

    this._quartiles = [
      1,
      this._countries[orderedCountries[Math.floor(tertileSize)]],
      this._countries[orderedCountries[Math.floor(2 * tertileSize)]]
    ];

  }

  get countries() {
    return this._countries;
  }

  get countriesCount() {
    return this._countriesCount;
  }

  get sectorTags(): Array<Tag> {
    return this._sectorTags;
  }

  get selectedTagsStats(): Array<TagStats> {
    return this._selectedTagsStats;
  }

  get stats(): TagStats {
    return this._stats;
  }

  get quartiles() {
    return this._quartiles;
  }

  get modalShow(): boolean {
    return this._modalShow;
  }

  set modalShow(value: boolean) {
    this._modalShow = value;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get loadingStats(): boolean {
    return this._loadingStats;
  }

}
