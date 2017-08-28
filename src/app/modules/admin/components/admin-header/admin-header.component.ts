import { Component, OnInit } from '@angular/core';
import { TranslateService, initTranslation } from './i18n/i18n';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.styl']
})
export class AdminHeaderComponent implements OnInit{

  constructor(private _translateService: TranslateService) { }

  ngOnInit(): void {
    initTranslation(this._translateService);
  }

}
