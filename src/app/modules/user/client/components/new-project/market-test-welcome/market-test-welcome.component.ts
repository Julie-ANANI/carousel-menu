import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-market-test-welcome',
  templateUrl: './market-test-welcome.component.html',
  styleUrls: ['./market-test-welcome.component.scss']
})
export class MarketTestWelcomeComponent {

  constructor(private _translateService: TranslateService) { }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

}
