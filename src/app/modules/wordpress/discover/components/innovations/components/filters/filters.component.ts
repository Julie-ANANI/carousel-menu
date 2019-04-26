import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '../../../../../../../models/tag';
import { TranslateService } from '@ngx-translate/core';
import { TagsService } from '../../../../../../../services/tags/tags.service';
import { FilterService } from '../../../../../../public/discover/components/innovations/services/filter.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})

export class FiltersComponent implements OnInit {

  @Input() set tags(value: Array<Tag>) {
    if (value) {
      this._allTags = value;
      this._sortTags('allTags');
      this._getHighlightedTags();
    }
  }

  @Output() appliedFilters = new EventEmitter<Array<Tag>>();

  private _userLang = '';

  private _allTags: Array<Tag> = [];

  private _selectedTags: Array<Tag> = [];

  private _selectedSimilarTags: Array<Tag> = [];

  private _highLightTags: Array<Tag> = [];

  private _suggestedTags: Array<Tag> = [];

  constructor(private _translateService: TranslateService,
              private _tagsService: TagsService,
              private _filterService: FilterService) {

    this._userLang = this._browserLang() || 'en' ;

    this._filterService.getFilterToRemove().subscribe((tagId: string) => {
      if (this._selectedSimilarTags.length === 0) {
        this.removeFilter(tagId);
      } else {
        const find = this._selectedSimilarTags.find((applyTag: Tag) => applyTag._id === tagId);
        if (find) {
          this.removeSimilarFilter(tagId)
        } else {
          this.removeFilter(tagId);
        }
      }
    });

  }

  ngOnInit() {
    this._getSuggestedTags();
    this._sendSelectedFilters();
  }


  /***
   * this function is to sort tags based on the type.
   * @param type
   * @private
   */
  private _sortTags(type: string) {
    switch (type) {

      case 'allTags':
        this._allTags = FilterService.sortTags(this._allTags, this._userLang);
        break;

      case 'suggested':
        this._suggestedTags = FilterService.sortTags(this._suggestedTags, this._userLang);
        break;

      case 'highlight':
        this._highLightTags = FilterService.sortTags(this._highLightTags, this._userLang);
        break;

      default:
      // do nothing...
    }
  }


  /***
   * this function is to get the highlighted tags from all the sector tags.
   * @private
   */
  private _getHighlightedTags() {
    this._highLightTags = FilterService.getHighlightedTags(this._allTags);
    this._sortTags('highlight');
  }


  /***
   * this function is to get the suggested tags based on the tag selected.
   * @private
   */
  private _getSuggestedTags() {
    this._suggestedTags = [];

    if (this._selectedTags.length !== 0 ) {
      this._tagsService.getSimilarTags(this._selectedTags[this._selectedTags.length - 1]._id).subscribe((response: Array<any>) => {
        if (response) {
          response.forEach((tag: Tag) => {
            const find = this._selectedTags.find((selectTag: Tag) => selectTag._id === tag._id);
            if (!find) {
              this._suggestedTags.push(tag);
            }
          });
        }
        this._sortTags('suggested');
      });
    }
  }


  /***
   * this function is to determine which filter is active or not.
   * @param id
   */
  public checkFilter(id: string): boolean {
    return this._selectedTags.some((item) => item._id === id);
  }


  /***
   * based on the filter is checked or unchecked we do the respective functions.
   * @param event
   * @param tag
   */
  toggleFilter(event: Event, tag: Tag) {

    if (event.target['checked']) {
      this._selectedTags.push(tag);
      this._selectedSimilarTags = [];
      this._getSuggestedTags();
      this._sendSelectedFilters();
    } else {
      this.removeFilter(tag._id);
    }
  }


  /***
   * this function is to remove the selected filter from the variable selectedTags.
   * @param id
   */
  public removeFilter(id: string) {
    const index = this._selectedTags.findIndex((tag) => tag._id === id);
    this._selectedTags.splice(index, 1);
    this._selectedSimilarTags = [];
    this._getSuggestedTags();
    this._sendSelectedFilters();
  }


  /***
   * this function is to determine which similar filter is active or not.
   * @param id
   */
  public checkSimilarFilter(id: string): boolean {
    return this._selectedSimilarTags.some((item) => item._id === id);
  }


  /***
   * based on the similar filter is checked or unchecked we do the respective functions.
   * @param event
   * @param tag
   */
  toggleSimilarFilter(event: Event, tag: Tag) {

    if (event.target['checked']) {
      this._selectedSimilarTags.push(tag);
      this._sendSelectedFilters();
    } else {
      this.removeSimilarFilter(tag._id);
    }
  }


  /***
   * this function is to remove the selected similar filter from the variable selectedTags.
   * @param id
   */
  public removeSimilarFilter(id: string) {
    const index = this._selectedSimilarTags.findIndex((tag) => tag._id === id);
    this._selectedSimilarTags.splice(index, 1);
    this._sendSelectedFilters();
  }


  private _sendSelectedFilters() {
    let selectTags = [];

    if (this._selectedSimilarTags.length === 0) {
      selectTags = this._selectedTags;
    } else {
      selectTags = this._selectedTags.concat(this._selectedSimilarTags);
    }

    this.appliedFilters.emit(selectTags);
  }


  private _browserLang(): string {
    return this._translateService.getBrowserLang();
  }


  get userLang(): string {
    return this._userLang;
  }

  get allTags(): Array<Tag> {
    return this._allTags;
  }

  get selectedTags(): Array<Tag> {
    return this._selectedTags;
  }

  get selectedSimilarTags(): Array<Tag> {
    return this._selectedSimilarTags;
  }

  get highLightTags(): Array<Tag> {
    return this._highLightTags;
  }

  get suggestedTags(): Array<Tag> {
    return this._suggestedTags;
  }

}
