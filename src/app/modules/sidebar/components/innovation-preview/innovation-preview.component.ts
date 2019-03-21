import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { InnovCard } from '../../../../models/innov-card';
import { Media } from '../../../../models/media';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-innovation-preview',
  templateUrl: './innovation-preview.component.html',
  styleUrls: ['./innovation-preview.component.scss']
})

export class InnovationPreviewComponent {

  @Input() set projectCard(value: InnovCard) {
    this._innovationCard = value;
  }

  @Input() set batchInfo(data: any) {
    if (data) {
      if (data.batchSelected && data.date) {
        const day = data.date.getDay();
        let Now = new Date(data.date);
        const beginWeek = new Date(Now.setDate(Now.getDate() - day));
        Now = new Date(data.date);
        const endWeek = new Date(Now.setDate(Now.getDate() - day + 6));
        const FM = new Date(data.batchSelected.firstMail);
        const SM = new Date(data.batchSelected.secondMail);
        const TM = new Date(data.batchSelected.thirdMail);
        if ((beginWeek < FM) && (FM < endWeek)) {
          this._date = data.batchSelected.firstMail;
        }
        if ((beginWeek < SM) && (SM < endWeek)) {
          this._date = data.batchSelected.secondMail;
        }
        if ((beginWeek < TM) && (TM < endWeek)) {
          this._date = data.batchSelected.thirdMail;
        }
      }
    }
  };

  private _date: Date;

  private _innovationCard: InnovCard;

  constructor(private domSanitizer1: DomSanitizer,
              private translateService: TranslateService,
              private innovationFrontService: InnovationFrontService) {}

  getSrc(media: Media): string {
    return this.innovationFrontService.getMediaSrc(media, 'mediaSrc', '180', '119');
  }

  get domSanitizer() {
    return this.domSanitizer1;
  }

  get getDate() {
    return this._date;
  }

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y HH:mm' : 'y/MM/dd HH:mm';
  }

  get innovationCard(): InnovCard {
    return this._innovationCard;
  }

}
