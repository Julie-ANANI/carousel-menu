import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MultilingPipe } from '../../../../pipe/pipes/multiling.pipe';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TagsService } from '../../../../services/tags/tags.service';
import { Tag } from '../../../../models/tag';
import { TagStats } from '../../../../models/tag-stats';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})

export class ShowcaseComponent {

  private readonly _sectorTags: Array<Tag>;

  private _selectedTagsStats: Array<TagStats> = [];

  private _countries: {[country: string]: number} = {};

  private _countriesCount = 0;

  private _stats: TagStats = {};

  private _maxFirstTertile = 0;

  private _maxSecondTertile = 0;

  private _modalShow: boolean = false;

  private _loadingStats: boolean;

  constructor(private _activatedRoute: ActivatedRoute,
              private _tagService: TagsService,
              private _translateService: TranslateService,
              private _translateNotificationService: TranslateNotificationsService) {

    if (Array.isArray(this._activatedRoute.snapshot.data['tags'])) {
      this._sectorTags = this._activatedRoute.snapshot.data['tags'].sort((t1, t2) => {
        const label1 = MultilingPipe.prototype.transform(t1.label, this._translateService.currentLang);
        const label2 = MultilingPipe.prototype.transform(t2.label, this._translateService.currentLang);
        return label1.localeCompare(label2);
      });
    } else {
      this._translateNotificationService.error('ERROR.ERROR_EN', 'ERROR.FETCHING_ERROR_EN');
    }

  }

  public modifyTag() {
    this._modalShow = true;
  }


  public onChangeTag(event: Event, tag: Tag) {
    this._loadingStats = true;

    if (event.target['checked']) {
      this._getTagStat(event, tag);
    } else {
      this._removeTag(tag._id);
    }

  }


  private _removeTag(tagId: string) {
    this._selectedTagsStats = this._selectedTagsStats.filter((item) => item.tag._id !== tagId);
    this._recomputeData();
  }


  private _getTagStat(event: Event, tag: Tag) {
    event.preventDefault();

    this._tagService.getStats(tag._id).subscribe((stats) => {
      this._selectedTagsStats = this._selectedTagsStats.concat(stats);
      this._recomputeData();
    }, () => {
      this._loadingStats = false;
      this._translateNotificationService.error('ERROR.ERROR_EN', `We are having trouble while finding the stats for ${tag.label.en} tag.`);
    });

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

    this._maxFirstTertile = this._countries[orderedCountries[Math.floor(tertileSize)]];

    this._maxSecondTertile = this._countries[orderedCountries[Math.floor(2 * tertileSize)]];

    this._loadingStats = false;

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

  get maxFirstTertile() {
    return this._maxFirstTertile;
  }

  get maxSecondTertile() {
    return this._maxSecondTertile;
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
