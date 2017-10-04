import { Component, OnInit } from '@angular/core';
import { TranslateService, initTranslation } from './i18n/i18n';

@Component({
  selector: 'app-client-terms-and-conditions',
  templateUrl: './client-terms-and-conditions.component.html',
  styleUrls: ['./client-terms-and-conditions.component.scss']
})
export class ClientTermsAndConditionsComponent implements OnInit {

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    initTranslation(this._translateService);
  }

}
