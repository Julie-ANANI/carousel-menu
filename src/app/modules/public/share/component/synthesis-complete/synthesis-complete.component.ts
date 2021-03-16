import {Component, Inject, PLATFORM_ID} from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { InnovCard } from '../../../../../models/innov-card';
import { TranslateService } from '@ngx-translate/core';
import {isPlatformBrowser} from '@angular/common';
import {ExecutiveReportService} from '../../../../../services/executive-report/executive-report.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ExecutiveReport} from '../../../../../models/executive-report';
import {InnovationFrontService} from '../../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-synthesis-complete',
  templateUrl: './synthesis-complete.component.html',
  styleUrls: ['./synthesis-complete.component.scss']
})

export class SynthesisCompleteComponent {

  private _projectId: string;

  private _shareKey: string;

  private _innovation: Innovation;

  private _displayReport: boolean;

  private _notFound: boolean;

  private _pageTitle = 'COMMON.PAGE_TITLE.REPORT';

  private _report: Innovation | ExecutiveReport = <Innovation | ExecutiveReport>{};

  private _reportTitle = '';

  private _reportMedia = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _executiveReportService: ExecutiveReportService,
              private _translateTitleService: TranslateTitleService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _authService: AuthService) {

    this._setPageTitle();

    this._activatedRoute.params.subscribe(params => {
      this._projectId = params['projectId'];
      this._shareKey = params['shareKey'];
      this._getSharedSynthesis();
    });

  }

  /***
   * this function is to get the shared synthesis detail from the server.
   */
  private _getSharedSynthesis() {

    this._innovationService.getSharedSynthesis(this._projectId, this._shareKey).subscribe((response: any) => {
      this._innovation = response;
      this._getExecutiveReport();

      if (this._innovation) {
        const userLangIndex = this._innovation.innovationCards.findIndex((card: InnovCard) => card.lang === this.userLang);

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

  /**
   * if the innovation has this._innovation.executiveReportId then we get that object from the back for the
   * front page because it has updated value for the client and objective.
   * @private
   */
  private _getExecutiveReport() {
    if (isPlatformBrowser(this._platformId)) {
      if (this._innovation && this._innovation.executiveReportId) {
        this._executiveReportService.get(this._innovation.executiveReportId).pipe(first()).subscribe((report) => {
          this._report = report;
          this._reportMedia = InnovationFrontService.principalMedia(this._innovation, this.userLang);
          this._reportTitle = InnovationFrontService.currentLangInnovationCard(this._innovation, this.userLang, 'TITLE');
        }, (err: HttpErrorResponse) => {
          this._report = this._innovation;
          console.error(err);
        });
      } else {
        this._report = this._innovation;
      }
    }
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

  get innovation(): Innovation {
    return this._innovation;
  }

  get displayReport(): boolean {
    return this._displayReport;
  }

  get notFound(): boolean {
    return this._notFound;
  }

  get userLang(): string {
    return this._translateService.currentLang;
  }

  get report(): Innovation | ExecutiveReport {
    return this._report;
  }

  get reportTitle(): string {
    return this._reportTitle;
  }

  get reportMedia(): string {
    return this._reportMedia;
  }

}
