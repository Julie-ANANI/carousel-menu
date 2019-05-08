import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Innovation } from '../../../../models/innovation';
import { TranslateService } from '@ngx-translate/core';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import { InnovCard } from '../../../../models/innov-card';

@Component({
  selector: 'app-shared-main-page',
  templateUrl: './shared-main-page.component.html',
  styleUrls: ['./shared-main-page.component.scss']
})

export class SharedMainPageComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  private _innovation: Innovation;

  private _currentInnovationIndex = 0;

  private _today: number;

  private _userLang: string;

  constructor(private _translateService: TranslateService) {

    this._userLang = this._translateService.currentLang;

  }

  ngOnInit() {
    this._today = Date.now();

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
    return InnovationFrontService.getMediaSrc(innovCard, 'default', '173', '110');
  }

  public get logo(): string {
    return environment.logoSynthURL;
  }

  public get contact(): string {
    return environment.commercialContact;
  }

  public get companyName(): string {
    return environment.companyShortName;
  }

  public get companyURL(): string {
    return environment.companyURL;
  }

  public get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  public get isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  public get ownerName(): string {
    return this._innovation.owner.name || '';
  }

  public get mailto(): string {
    return `mailto:${environment.commercialContact}`;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get currentInnovationIndex(): number {
    return this._currentInnovationIndex;
  }

  get today(): number {
    return this._today;
  }

  get userLang(): string {
    return this._userLang;
  }

}
