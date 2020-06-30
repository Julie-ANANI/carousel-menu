import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { InnovCard } from '../../../../models/innov-card';
import { Media } from '../../../../models/media';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-sidebar-innovCard-preview',
  templateUrl: './sidebar-innovCard-preview.component.html',
  styleUrls: ['./sidebar-innovCard-preview.component.scss']
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
  };

  private _date: Date;

  constructor(private _domSanitizer1: DomSanitizer,
              private _translateService: TranslateService) { }

  public imageSrc(media: Media): string {
    return InnovationFrontService.imageSrc(media, '180', '119');
  }

  public sectionInfo(field: 'ISSUE' | 'SOLUTION'): string {
    return <string>InnovationFrontService.cardDynamicSection(this.innovCard, field).content;
  }

  get domSanitizer() {
    return this._domSanitizer1;
  }

  get getDate() {
    return this._date;
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y HH:mm' : 'y/MM/dd HH:mm';
  }

}
