import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { InnovCard } from '../../../../../../models/innov-card';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-synthesis-comp-innov-desc',
  templateUrl: './synthesis-comp-innov-desc.component.html',
  styleUrls: ['./synthesis-comp-innov-desc.component.scss']
})

export class SynthesisCompInnovDescComponent {

  @Input() set innovation(value: Innovation) {
    if (!!value) {
      this._innovCard = InnovationFrontService.currentLangInnovationCard(value, this.userLang, 'CARD');
      this._principalMedia = InnovationFrontService.principalMedia(value, this.userLang, '220', '146');
    }
  }

  private _innovCard: InnovCard = <InnovCard>{};

  private _principalMedia = '';

  constructor(private _translateService: TranslateService) { }

  /**
   * checking the section visibility.
   * @param field
   */
  public sectionInfo(field: 'ISSUE' | 'SOLUTION') {
    if (this._innovCard.sections && this._innovCard.sections.length) {
      const _section = InnovationFrontService.cardDynamicSection(this._innovCard, field);
      if (_section && _section.visibility) {
        return _section.content;
      }
    }
    return '';
  }

  get userLang(): string {
    return this._translateService.currentLang || 'en';
  }

  get innovCard(): InnovCard {
    return this._innovCard;
  }

  get principalMedia(): string {
    return this._principalMedia;
  }

}
