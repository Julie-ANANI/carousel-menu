import { Component, Input, OnInit } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { InnovCard } from '../../../../../../models/innov-card';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-innovation-detail',
  templateUrl: './innovation-detail.component.html',
  styleUrls: ['./innovation-detail.component.scss']
})
export class InnovationDetailComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  private _innovation: Innovation;

  private _currentInnovationIndex = 0;

  private _userLang: string;

  constructor(private _translateService: TranslateService) {

    this._userLang = this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';

  }

  ngOnInit() {

    /***
     * here we are registering the index of the lang of the user and according to that we display the innovation.
     * @type {number}
     */
    const index = this._innovation.innovationCards.findIndex((items) => items.lang === this._userLang);
    this._currentInnovationIndex = index !== -1 ? index : 0;

  }

  /***
   * This function is getting the image source.
   * @returns {string}
   */
  public getSrc(innovCard: InnovCard): string {
    return InnovationFrontService.getMediaSrc(innovCard, 'default', '220', '146');
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get currentInnovationIndex(): number {
    return this._currentInnovationIndex;
  }

  get userLang(): string {
    return this._userLang;
  }

}
