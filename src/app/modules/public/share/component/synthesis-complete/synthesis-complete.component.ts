import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { InnovCard } from '../../../../../models/innov-card';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-synthesis-complete',
  templateUrl: './synthesis-complete.component.html',
  styleUrls: ['./synthesis-complete.component.scss']
})

export class SynthesisCompleteComponent implements OnInit {

  private _projectId: string;

  private _shareKey: string;

  private _innovation: Innovation;

  private _displayReport: boolean;

  private _notFound: boolean;

  private _pageTitle = 'COMMON.PAGE_TITLE.REPORT';

  private _userLang = 'en';

  constructor(private _translateTitleService: TranslateTitleService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _authService: AuthService) {

    this._setPageTitle();

    this._userLang = this._translateService.currentLang || this._translateService.getBrowserLang();

    this._activatedRoute.params.subscribe(params => {
      this._projectId = params['projectId'];
      this._shareKey = params['shareKey'];
      this._getSharedSynthesis();
    });

  }

  ngOnInit() {
  }

  /***
   * this function is to get the shared synthesis detail from the server.
   */
  private _getSharedSynthesis() {

    this._innovationService.getSharedSynthesis(this._projectId, this._shareKey).subscribe((response: any) => {
      this._innovation = response;

      if (this._innovation) {
        const userLangIndex = this._innovation.innovationCards.findIndex((card: InnovCard) => card.lang === this._userLang);

        if (userLangIndex !== -1) {
          this._pageTitle = this._innovation.innovationCards[userLangIndex].title;
        } else {
          this._pageTitle = this._innovation.innovationCards[0].title;
        }

        this._setPageTitle();
      }

      }, () => {
      this._displayReport = false;
      this._notFound = true;
      }, () => {
      if (this._innovation !== undefined) {
        this._displayReport = true;
      } else {
        this._notFound = true;
      }
    });

  }


  private _setPageTitle() {
    this._translateTitleService.setTitle(this._pageTitle);
  }


  get authService() {
    return this._authService;
  }

  get projectId(): string {
    return this._projectId;
  }

  get shareKey(): string {
    return this._shareKey;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get displayReport(): boolean {
    return this._displayReport;
  }

  get notFound(): boolean {
    return this._notFound;
  }

  get pageTitle(): string {
    return this._pageTitle;
  }

  get userLang(): string {
    return this._userLang;
  }

}
