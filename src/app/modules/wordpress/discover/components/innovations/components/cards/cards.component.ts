import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { Innovation } from '../../../../../../../models/innovation';
import { LocalStorageService } from '../../../../../../../services/localStorage/localStorage.service';
import { isPlatformBrowser } from '@angular/common';
import { InnovCard } from '../../../../../../../models/innov-card';
import { TranslateService } from '@ngx-translate/core';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})

export class CardsComponent {

  @Input() set allInnovations(value: Array<Innovation>) {
    this._innovations = value;
    this._totalInnovations = value.length;
  }

  @Input() set pagination(value: boolean) {
    this._isPagination = value;
    this._endIndex = parseInt(this._localStorage.getItem('discover-page-limit'), 10) || 50;
  }

  @Input() set search(value: boolean) {
    this._isSearching = value;
  }

  @Input() set lastIndex(value: number) {
    this._endIndex = value;
  }

  private _paginationValue: any = {};

  private _innovations: Array<Innovation> = [];

  private _totalInnovations: number;

  private _startIndex: number = 0;

  private _endIndex: number = 4;

  private _isPagination: boolean = false;

  private _userLang = 'en';

  private _isSearching: boolean = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _localStorage: LocalStorageService,
              private _translateService: TranslateService,
              private _activatedRoute: ActivatedRoute) {

    this._activatedRoute.params.subscribe(params => {
      this._userLang = params['lang'];
    });

  }


  /***
   * this function is to return the innovation field based on the requested 'toReturn'.
   * @param toReturn
   * @param innovation
   */
  public getInnovationDetail(toReturn: string, innovation: Innovation):string {
    let value = '';
    let index = 0;

    if (innovation.innovationCards.length > 1) {
      const userLangIndex = innovation.innovationCards.findIndex((card: InnovCard) => card.lang === this._userLang);
      if (userLangIndex !== -1) {
        index = userLangIndex;
      }
    } else {
      const indexEn = innovation.innovationCards.findIndex((card: InnovCard) => card.lang === 'en');
      if (indexEn !== -1) {
        index = indexEn;
      } else {
        index = 0;
      }
    }

    switch (toReturn) {

      case 'url':
        value = `wordpress/discover/${innovation.innovationCards[index].innovation_reference}/${innovation.innovationCards[index].lang}`;
        break;

      case 'title':
        value = innovation.innovationCards[index].title;
        break;

      case 'imageUrl':
        value = InnovationFrontService.getMediaSrc(innovation.innovationCards[index], 'default', '320', '200');
        break;

      default:
        // do nothing...

    }

    return value;

  }


  /***
   * when there is change in the paginations we detect the change and
   * update the innovation cards with the new limit and offset value.
   * @param value
   */
  public onChangePagination(value: any) {
    if (isPlatformBrowser(this._platformId)) {

      const tempOffset = parseInt(value.offset, 10);
      const tempLimit = parseInt(value.limit, 10);

      this._startIndex = tempOffset;
      this._endIndex = tempLimit;

      if (value.limit >= this._totalInnovations) {
        this._startIndex = 0;
        this._endIndex = this._totalInnovations;
      } else {
        if (value.offset === 0) {
          this._startIndex = 0;
          this._endIndex = tempLimit;
        } else if (value.offset > 0) {
          this._startIndex = tempOffset;
          this._endIndex += tempOffset;
        }
      }
    }
  }


  public browserLang(): string {
    return this._translateService.getBrowserLang();
  }

  get paginationValue(): any {
    return this._paginationValue;
  }

  get innovations(): Array<Innovation> {
    return this._innovations;
  }

  get totalInnovations(): number {
    return this._totalInnovations;
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

  get userLang(): string {
    return this._userLang;
  }

  get isSearching(): boolean {
    return this._isSearching;
  }

}
