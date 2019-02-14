/**
 * Created by bastien on 08/12/2017.
 */
import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class TranslateTitleService implements OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _translateService: TranslateService,
              private _titleService: Title) { }

    public setTitle(title: string) {
      this._translateService.get(title).pipe(takeUntil(this.ngUnsubscribe)).subscribe((translatedTitle: string) => {
        return this._titleService.setTitle(translatedTitle);
      });
    }

    ngOnDestroy() {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
}
