import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { Innovation } from '../../../../../../../models/innovation';
import { LocalStorageService } from '../../../../../../../services/localStorage/localStorage.service';
import { InnovCard } from '../../../../../../../models/innov-card';
import { TranslateService } from '@ngx-translate/core';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { Pagination } from '../../../../../../utility/paginations/interfaces/pagination';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})

export class CardsComponent {

  @Input() set allInnovations(value: Array<Innovation>) {
    this._totalInnovations = value;
    this._total = value.length;
    this._initializeInnovations();
  }

  @Input() set isPagination(value: boolean) {
    this._isPagination = value;
    this._endIndex = parseInt(this._localStorage.getItem('discover-limit'), 10) || 25;
    this._initializePagination();
  }

  @Input() set stopLoading(value: boolean) {
    this._stopLoading = value;
    this._initializeInnovations();
  }

  private _pagination: Pagination;

  private _innovations: Array<any> = [];

  private _totalInnovations: Array<Innovation> = [];

  private _total: number;

  private _startIndex: number = 0;

  private _endIndex: number = 4;

  private _isPagination: boolean;

  private _stopLoading: boolean;

  private _userLang = this._translateService.currentLang || 'en';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _localStorage: LocalStorageService,
              private _translateService: TranslateService) { }


  private _initializeInnovations() {
    if (this._stopLoading) {
      this._innovations = this._totalInnovations;
    } else {
      for (let i = 0; i < this._endIndex; i++ ) {
        this._innovations.push(i);
      }
    }
  }

  private _initializePagination() {
    this._pagination = {
      propertyName: 'discover-limit',
      offset: 0,
      parPage: this._endIndex
    };
  }

  /***
   * this function is to return the innovation field based on the requested 'toReturn'.
   * @param toReturn
   * @param innovation
   */
  public getInnovationDetail(toReturn: string, innovation: Innovation): string {
    const _card: InnovCard = <InnovCard>InnovationFrontService.currentLangInnovationCard(innovation, this._userLang, 'card');

    switch (toReturn) {
      case 'url':
        return innovation._id && _card && _card.lang ? `discover/${innovation._id}/${_card.lang}` : '';

      case 'title':
        return _card && _card.title ? _card.title : '';

      case 'imageUrl':
        return innovation._id ? InnovationFrontService.principalMedia(innovation, this._userLang, 'auto', '174') : '';
    }
  }

  get pagination(): Pagination {
    return this._pagination;
  }

  set pagination(value: Pagination) {
    this._pagination = value;
    this._startIndex = value.offset;
    this._endIndex = value.currentPage * value.parPage;
  }

  get innovations(): Array<any> {
    return this._innovations;
  }

  get total(): number {
    return this._total;
  }

  get startIndex(): number {
    return this._startIndex;
  }

  get endIndex(): number {
    return this._endIndex;
  }

  get isPagination(): boolean {
    return this._isPagination;
  }

  get stopLoading(): boolean {
    return this._stopLoading;
  }

}
