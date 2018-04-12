import { Component, OnInit } from '@angular/core';
import { TranslateService, initTranslation } from '../../i18n/i18n';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss']
})
export class FooterComponent implements OnInit {
  private _companyName: string = environment.companyName;
  public displayLangChoices = false;

  constructor (private _translateService: TranslateService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get companyName(): string {
    return `${this._companyName} ${this.isMainDomain() ? '' : ' by United Motion Ideas'}`;
  }

  get translate (): TranslateService {
    return this._translateService;
  }

  get copyrightDate (): string {
    return (new Date()).getFullYear().toString();
  }
}
