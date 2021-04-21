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

  getChildren(item: any) {
    return ['child1', 'child2'];
  }

  getContext(
    title: string,
    hasChildren: boolean,
    dataSource?: Array<any>,
    item?: any,
    i?: number,
    j?: number
  ) {
    return {
      title: title,
      hasChildren: hasChildren,
      dataSource: dataSource || [],
      item: item,
      indexF: i,
      indexC: j,
    };
  }

  selectItem(event: Event, context: any) {
    if (context.title === 'Select all') {
      this.initialiseSources((event.target as HTMLInputElement).checked);
    } else {
      if (context.hasChildren) {
        context.item.isSelected = !context.item.isSelected;
        context.item.isOpened = context.item.isSelected;
        context.item.children.map(
          (c: any) => (c.isSelected = context.item.isSelected)
        );
      } else {
        context.item.isSelected = !context.item.isSelected;
      }
    }
    this.sendFilters.emit(this._sources);
  }

  ngOnInit(): void {
    if (this._type !== 'default') {
      this._subFilters = this._campaignFrontService
        .getFilters()
        .subscribe((data) => {
          this._sources = data;
          this.initialiseSources(false);
        });
    }
  }

  initialiseSources(value: boolean) {
    this._sources.map((item) => {
      item.isOpened = value;
      item.isSelected = value;
      if (item.hasOwnProperty('children')) {
        item['children'].map((c: any) => {
          c.isSelected = value;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this._subFilters.unsubscribe();
  }

  openCheckBoxGroup(context: any) {
    context.item.isOpened = !context.item.isOpened;
    this.sendFilters.emit(this._sources);
  }
}
