/**
 * Created by bastien on 08/12/2017.
 */
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslateTitleService {

  constructor(private _translateService: TranslateService,
              private _titleService: Title) { }

    public setTitle(title: string) {
      this._translateService.get(title).subscribe((translatedTitle: string) => {
        return this._titleService.setTitle(translatedTitle);
      });
    }
}
