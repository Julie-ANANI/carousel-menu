import {Component, EventEmitter, Input, Output} from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovCard } from '../../../../../../models/innov-card';
import { TagStats } from '../../../../../../models/tag-stats';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
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
          const staticInnovations = value.every((t) => t.static);
          if (staticInnovations) {
            this._computeCards();
          } else {
            this.topInnovationsChange.emit(response.result.slice(0, 9));
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
    this._computeCards();
  }
  @Output() topInnovationsChange: EventEmitter<Array<Innovation>> = new EventEmitter<Array<Innovation>>();

  private _tags: Array<string> = [];

  private _innovations: Array<Innovation> = [];

  private _cards: Array<{title: string, _id: string, media: string}> = [];

  private _topCards: Array<{title: string, _id: string, media: string}> = [];

  private _selectedInnovations: {[innoId: string]: boolean} = {};

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
        _id: innovation._id,
        title: innovationCard.title,
        media: InnovationFrontService.getMediaSrc(innovationCard, 'default', '320', '200')
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
    return this._selectedInnovations[id];
  }

  public onChangeInnovation(event: Event, card: any) {
    this._selectedInnovations[card._id] = (event.target as HTMLInputElement).checked;
  }

  public onClickApply(event: Event) {
    event.preventDefault();
    const selectedInnovation = this._innovations.filter((i) => this._selectedInnovations[i._id]).slice(0, 9);
    this.topInnovationsChange.emit(selectedInnovation);
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
