/**
 * Created by bastien on 08/12/2017.
 */
import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class TranslateTitleService implements OnDestroy {

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _translateService: TranslateService,
              private _titleService: Title) { }

  public setTitle(title: string) {
    this._translateService.get(title).pipe(takeUntil(this._ngUnsubscribe)).subscribe((translatedTitle: string) => {
      return this._titleService.setTitle(translatedTitle + ' | ' + environment.companyShortName);
    });
  }

  public getTitle() {
    return this._titleService.getTitle();
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
