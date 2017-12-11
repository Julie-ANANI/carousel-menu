import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { TranslateService, initTranslation } from './i18n/i18n';

@Component({
  selector: 'app-shared-not-found',
  templateUrl: './shared-not-found.component.html',
  styleUrls: ['./shared-not-found.component.scss']
})
export class SharedNotFoundComponent implements OnInit {

  constructor(private _titleService: TranslateTitleService,
              private _translateService: TranslateService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._translateService.get('404.PAGE_NOT_FOUND').subscribe((res: string) => {
      this._titleService.setTitle(res);
    });
  }

}
