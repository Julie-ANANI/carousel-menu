import { Component, Input } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../models/innovation';
import { InnovCard } from '../../../../models/innov-card';
import { TagStats } from '../../../../models/tag-stats';

@Component({
  selector: 'app-showcase-innovations',
  templateUrl: './showcase-innovations.component.html',
})

export class ShowcaseInnovationsComponent {

  @Input() totalInnovations: number;

  @Input() set tagsStats(value: Array<TagStats>) {
    this.reqInnos(value);
  }
  public openInnovationsModal = false;

  private _innovations: Array<Innovation> = [];
  private _topInnovations: Array<Innovation> = [];
  private _cards: Array<{title: string, media: string}> = [];
  private _topCards: Array<{title: string, media: string}> = [];

  constructor(private innovationService: InnovationService,
              private translateService: TranslateService) {

    this.translateService.onLangChange.subscribe((_event: LangChangeEvent) => {
      this.computeCards();
    });

  }

  private reqInnos(value: Array<TagStats>): void {
    const tags_id = value.map((st) => st.tag._id);
    if (tags_id.length > 0) {
      const config = {
        fields: 'created name principalMedia status',
        isPublic: '1',
        status: JSON.stringify({$in: ['EVALUATING', 'DONE']}),
        tags: JSON.stringify({ $in: tags_id }),
        sort: '{"created":-1}'
      };
      this.innovationService.getAll(config).subscribe((next) => {
        if (Array.isArray(next.result)) {
          this._innovations = next.result;
          this._topInnovations = next.result.slice(0, 6);
          this.computeCards();
        }
      });
    } else {
      this._topInnovations = [];
      this.computeCards();
    }
  }

  private computeCards(): void {
    const innovationToCard = (inno: Innovation) => {
      let innovationCard = inno.innovationCards.find((card: InnovCard) => card.lang === this.translateService.currentLang);
      if (!innovationCard) {
        innovationCard = inno.innovationCards.find((card: InnovCard) => card.lang === this.translateService.defaultLang);
        if (!innovationCard) {
          innovationCard = inno.innovationCards[0];
        }
      }
      return {
        title: innovationCard.title,
        media: InnovationFrontService.getMediaSrc(innovationCard, 'default', '320', '200')
      };
    };
    this._topCards = this._topInnovations.map(innovationToCard);
    this._cards = this._innovations.map(innovationToCard);
  }

  get cards() {
    return this._cards;
  }

  get topCards() {
    return this._topCards;
  }

}
