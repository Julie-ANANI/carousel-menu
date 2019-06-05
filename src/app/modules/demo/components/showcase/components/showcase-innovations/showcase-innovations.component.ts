import { Component, Input } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovCard } from '../../../../../../models/innov-card';
import { TagStats } from '../../../../../../models/tag-stats';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { AuthService } from '../../../../../../services/auth/auth.service';

@Component({
  selector: 'app-showcase-innovations',
  templateUrl: './showcase-innovations.component.html',
  styleUrls: ['./showcase-innovations.component.scss']
})

export class ShowcaseInnovationsComponent {

  @Input() set tagsStats(value: Array<TagStats>) {
    this._getInnovations(value);
  }

  private _tags: Array<string> = [];

  private _innovations: Array<Innovation> = [];

  private _topInnovations: Array<Innovation> = [];

  private _cards: Array<{title: string, _id: string, media: string}> = [];

  private _topCards: Array<{title: string, _id: string, media: string}> = [];

  private _selectedCards: Array<{title: string, _id: string, media: string}> = [];

  private _count = 0;

  private readonly _adminPass: boolean = false;

  private _modalShow = false;

  constructor(private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _authService: AuthService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._adminPass = this._authService.adminLevel > 2;
    this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this._computeCards();
    });

  }


  private _getInnovations(value: Array<TagStats>): void {
    this._tags = value.map((st) => st.tag._id);

    if (this._tags.length > 0) {

      const config = {
        fields: 'created name principalMedia status',
        isPublic: '1',
        status: JSON.stringify({$in: ['EVALUATING', 'DONE']}),
        tags: JSON.stringify({ $in: this._tags }),
        sort: '{"created":-1}'
      };

      this._innovationService.getAll(config).subscribe((response: any) => {
        if (Array.isArray(response.result)) {
          this._innovations = response.result;
          this._count = this._innovations.length;
          this._topInnovations = response.result.slice(0, 6);
          this._computeCards();
        }
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'FETCHING_ERROR');
      });

    } else {
      this._topInnovations = [];
      this._computeCards();
    }
  }


  private _computeCards() {
    const innovationToCard = (innovation: Innovation) => {
      let innovationCard = innovation.innovationCards.find((card: InnovCard) => card.lang === this._translateService.currentLang);

      if (!innovationCard) {
        innovationCard = innovation.innovationCards.find((card: InnovCard) => card.lang === this._translateService.defaultLang);

        if (!innovationCard) {
          innovationCard = innovation.innovationCards[0];
        }

      }
      return {
        _id: innovation._id,
        title: innovationCard.title,
        media: InnovationFrontService.getMediaSrc(innovationCard, 'default', '320', '200')
      };
    };

    this._selectedCards = this._topInnovations.map(innovationToCard);
    this._topCards = this._selectedCards;
    this._cards = this._innovations.map(innovationToCard);

  }


  public openModal(event: Event) {
    event.preventDefault();
    this._modalShow = true;
  }


  public activeInnovation(card: any) {
    return this._selectedCards.some((item: any) => item._id === card._id);
  }


  public onChangeInnovation(event: Event, card: any) {
    if (event.target['checked']) {
      if (this._selectedCards.length < 6) {
        this._selectedCards.push(card);
      } else {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.MAX_SELECT_INNOVATIONS');
      }
    } else {
      this._selectedCards = this._selectedCards.filter((item: any) => item._id !== card._id);
    }
  }


  public onClickApply(event: Event) {
    event.preventDefault();
    this._topCards = this._selectedCards;
    this._modalShow = false;
  }


  get cards() {
    return this._cards;
  }

  get tags() {
    return this._tags;
  }

  get topCards() {
    return this._topCards;
  }

  get innovations(): Array<Innovation> {
    return this._innovations;
  }

  get count(): number {
    return this._count;
  }

  get adminPass(): boolean {
    return this._adminPass;
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get modalShow(): boolean {
    return this._modalShow;
  }

  set modalShow(value: boolean) {
    this._modalShow = value;
  }

}
