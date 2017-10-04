import { Component, OnInit } from '@angular/core';
import { TranslateService, initTranslation } from './i18n/i18n';

@Component({
  selector: 'app-client-legal-notice',
  templateUrl: './client-legal-notice.component.html',
  styleUrls: ['./client-legal-notice.component.scss']
})
export class ClientLegalNoticeComponent implements OnInit {

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    initTranslation(this._translateService);
  }

}
