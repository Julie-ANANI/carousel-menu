import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CheckBoxFilterConfig } from './interface/check-box-filter-config';
import { CampaignFrontService } from '../../../services/campaign/campaign-front.service';
import { Subscription } from 'rxjs';
import { countries } from '../../../models/static-data/country';

@Component({
  selector: 'app-check-box-filter',
  templateUrl: './check-box-filter.component.html',
  styleUrls: ['./check-box-filter.component.scss'],
})
export class CheckBoxFilterComponent implements OnInit, OnDestroy {
  @Input() set config(config: CheckBoxFilterConfig) {
    if (config) {
      this._sources = config.sources;
      this._hasChildrenItem = config.hasChildrenItem || false;
      this._isCanSelectAll = config.isCanSelectAll || false;
      this._height = config.height || '40px';
      this._title = config.title || 'Filter';
      this._type = config.type || 'default';
    }
  }

  @Output() sendFilters = new EventEmitter();

  private _sources: Array<any> = [];

  private _type = 'default';

  private _hasChildrenItem = false;

  private _isCanSelectAll = false;

  private _height = '40px';

  private _title = 'Filter';

  private _displaySources: Array<any> = [];

  private _subFilters: Subscription;

  constructor(private _campaignFrontService: CampaignFrontService) {}

  get sources(): Array<any> {
    return this._sources;
  }

  get hasChildrenItem(): boolean {
    return this._hasChildrenItem;
  }

  get isCanSelectAll(): boolean {
    return this._isCanSelectAll;
  }

  get height(): string {
    return this._height;
  }

  get title(): string {
    return this._title;
  }

  getContext(item: any, i: any) {
    return {
      item: item,
      index: i,
    };
  }

  selectItem(event: Event, context: any) {
    if (context.item.label === 'Select All') {
      this.initialiseSources((event.target as HTMLInputElement).checked);
    } else {
      this._displaySources[context.index].isSelected = (event.target as HTMLInputElement).checked;
      this._sources[context.index].isSelected = (event.target as HTMLInputElement).checked;
    }
    this.sendFilters.emit(this._sources);
  }

  ngOnInit(): void {
    if (this._type !== 'default') {
      this._subFilters = this._campaignFrontService
        .getFilters()
        .subscribe((data) => {
          if (
            this._sources.length - data.length &&
            this._sources.length - 1 !== data.length
          ) {
            this._sources = [];
            data.map((item) => {
              this._sources.push({ label: item, isSelected: false });
            });
            if (this._isCanSelectAll) {
              this._sources.unshift({
                label: 'Select All',
                isSelected: false,
              });
            }
            this._displaySources = JSON.parse(JSON.stringify(this._sources));
          }
        });
    }
  }

  public getCountryName(isoCode: string): string {
    if (isoCode) {
      return countries[isoCode] || 'NA';
    } else {
      return 'NA';
    }
  }

  initialiseSources(value: boolean) {
    this._displaySources.map((item) => {
      item.isSelected = value;
    });
    this._sources.map((item) => {
      item.isSelected = value;
    });
  }

  ngOnDestroy(): void {
    this._subFilters.unsubscribe();
  }

  displayResults(event: string) {
    if (event !== '') {
      this._displaySources = this._sources.filter((item) =>
        event.toUpperCase().split('-').includes(item.label.toUpperCase())
      );
    } else {
      this._displaySources = this._sources;
    }
  }

  get displaySources(): Array<any> {
    return this._displaySources;
  }
}
