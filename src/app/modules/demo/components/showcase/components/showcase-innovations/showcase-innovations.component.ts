import {Component, EventEmitter, Input, Output} from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovCard } from '../../../../../../models/innov-card';
import { TagStats } from '../../../../../../models/tag-stats';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { AuthService } from '../../../../../../services/auth/auth.service';

@Component({
  selector: 'app-showcase-innovations[tagsStats]',
  templateUrl: './showcase-innovations.component.html',
  styleUrls: ['./showcase-innovations.component.scss']
})

export class ShowcaseInnovationsComponent {

  @Input() set tagsStats(value: Array<TagStats>) {
    this._tags = value.map((st) => st.tag._id);

    if (this._tags.length > 0) {
      const config = {
        fields: 'created name principalMedia status innovationCards',
        isPublic: '1',
        status: JSON.stringify({$in: ['EVALUATING', 'DONE']}),
        tags: JSON.stringify({ $in: this._tags }),
        sort: '{"created":-1}'
      };
      this._innovationService.getAll(config).subscribe((response: any) => {
        if (Array.isArray(response.result)) {
          this._innovations = response.result;
          this._count = response.result.length;
          const staticInnovations = value.every((t) => t.static);
          if (staticInnovations) {
            this._computeCards();
          } else {
            this.topInnovationsChange.emit(response.result.slice(0, 6));
          }
        }
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
      });
    } else {
      this.topInnovationsChange.emit([]);
    }
  }

  private _topInnovations: Array<Innovation> = [];
  @Input() set topInnovations(value: Array<Innovation>) {
    this._topInnovations = value;
    this._selectedInnovations = value;
    this._computeCards();
  }
  @Output() topInnovationsChange: EventEmitter<Array<Innovation>> = new EventEmitter<Array<Innovation>>();

  private _tags: Array<string> = [];

  private _innovations: Array<Innovation> = [];

  private _cards: Array<{title: string, media: string}> = [];

  private _topCards: Array<{title: string, media: string, innovation: Innovation}> = [];

  private _selectedInnovations: Array<Innovation> = [];

  private _count = 0;

  private _modalShow = false;

  constructor(private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _authService: AuthService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._translateService.onLangChange.subscribe((_event: LangChangeEvent) => {
      this._computeCards();
    });

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
        title: innovationCard.title,
        media: InnovationFrontService.getMediaSrc(innovationCard, 'default', '320', '200'),
        innovation: innovation
      };
    };

    this._topCards = this._topInnovations.map(innovationToCard);
    this._cards = this._innovations.map(innovationToCard);

  }

  public openModal(event: Event) {
    event.preventDefault();
    this._modalShow = true;
  }

  public activeInnovation(id: string) {
    return this._selectedInnovations.findIndex((inno: Innovation) => inno._id === id) !== -1;
  }

  public onChangeInnovation(event: Event, card: any) {
    const innoIdx = this._selectedInnovations.findIndex((inno) => inno._id === card.innovation._id);
    if (innoIdx === -1) {
      this._selectedInnovations = [...this._selectedInnovations, card.innovation];
    } else {
      this._selectedInnovations = this._selectedInnovations.filter((inno) => inno._id !== card.innovation._id);
    }
  }

  public onClickApply(event: Event) {
    event.preventDefault();
    this.topInnovationsChange.emit(this._selectedInnovations);
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

  get count(): number {
    return this._count;
  }

  get isAdmin(): boolean {
    return this._authService.isAdmin;
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
