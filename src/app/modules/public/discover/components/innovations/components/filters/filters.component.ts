import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Tag } from '../../../../../../../models/tag';
import { MultilingPipe } from '../../../../../../../pipe/pipes/multiling.pipe';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  animations: [

    trigger('tagAnimation', [
      transition('* => *', [

        query('.tag-content', style({ opacity: 0, transform: 'translateX(-15%)' }), { optional: true }),

        query('.tag-content', stagger('100ms', [
          animate('.15s ease', style({ opacity: 1, transform: 'translateX(0)' })),
        ]), { optional: true }),

      ])
    ])

  ]
})

export class FiltersComponent implements OnInit {

  @Input() set tags(value: Array<Tag>) {
    if (value) {
      this.allFilters = value;
      this._sortTags();
      this._getHighlightedTags();
    }
  }

  @Output() appliedFilters = new EventEmitter<Array<Tag>>();

  allFilters: Array<Tag> = [];

  selectedFilters: Array<Tag> = [];

  // highlight: Array<string> = ['construction', 'software', 'industry', 'energy', 'healthcare', 'chemistry', 'transportation', 'services', 'environment', 'aerospace', 'network', 'it'];

  highlight: Array<string> = ['sector-tag-1', 'sector-tag-2', 'sector-tag-3'];

  highLightTags: Array<Tag> = [];

  userLang = '';

  constructor(private _translateService: TranslateService,
              @Inject(PLATFORM_ID) protected _platformId: Object,) {

    this.userLang = this._translateService.currentLang || this._browserLang() || 'en' ;

  }

  ngOnInit() {
    this._initializeFunctions();
  }


  private _initializeFunctions() {
    this._checkStoredFilters();
    this._sendSelectedFilters();
  }


  private _sortTags() {

    this.allFilters = this.allFilters.sort((a: Tag, b: Tag) => {

      const labelA = MultilingPipe.prototype.transform(a.label, this.userLang).toLowerCase();
      const labelB =  MultilingPipe.prototype.transform(b.label, this.userLang).toLowerCase();

      if ( labelA > labelB) {
        return 1;
      }

      if (labelA < labelB) {
        return -1;
      }

      return 0;

    });

  }


  /***
   * this function is to get the highlighted tags from all the sector tags.
   * @private
   */
  private _getHighlightedTags() {
    this.highLightTags = [];

    this.allFilters.forEach((tag: Tag) => {
      const include = this.highlight.includes(tag.label.en.toLowerCase());
      if (include) {
        this.highLightTags.push(tag);
      }
    });

  }


  /***
   * this function checks do we have any filters stored in session storage.
   */
  private _checkStoredFilters() {
    if (isPlatformBrowser(this._platformId)) {
      const sessionValues = JSON.parse(sessionStorage.getItem('discover-filters')) || 0;
      if (sessionValues.length > 0) {
        this.selectedFilters = sessionValues;
      } else {
        this.selectedFilters = [];
      }
    }
  }


  private _sendSelectedFilters() {
    this.appliedFilters.emit(this.selectedFilters);
  }


  private _browserLang(): string {
    return this._translateService.getBrowserLang();
  }


}
