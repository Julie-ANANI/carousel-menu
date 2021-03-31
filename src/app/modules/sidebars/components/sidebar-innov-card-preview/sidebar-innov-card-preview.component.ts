import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { InnovCard } from '../../../../models/innov-card';
import { Media } from '../../../../models/media';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import {CommonService} from '../../../../services/common/common.service';
import {MediaFrontService} from '../../../../services/media/media-front.service';

@Component({
  selector: 'app-sidebar-innov-card-preview',
  templateUrl: './sidebar-innov-card-preview.component.html',
  styleUrls: ['./sidebar-innov-card-preview.component.scss']
})

export class SidebarInnovCardPreviewComponent {

  @Input() innovCard: InnovCard = <InnovCard>{};

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
  }

  private _date: Date;

  private _dateFormat = CommonService.dateFormat(this._translateService.currentLang);

  constructor(private _domSanitizer1: DomSanitizer,
              private _translateService: TranslateService) { }

  public imageSrc(media: Media): string {
    return MediaFrontService.imageSrc(media, '180', '119');
  }

  public sectionInfo(field: 'ISSUE' | 'SOLUTION'): string {
    const _section = InnovationFrontService.cardDynamicSection(this.innovCard, field);
    if (_section && _section.visibility) {
      return <string>_section.content;
    }
    return '';
  }

  get domSanitizer() {
    return this._domSanitizer1;
  }

  get getDate() {
    return this._date;
  }

  get dateFormat(): string {
    return this._dateFormat;
  }

}
