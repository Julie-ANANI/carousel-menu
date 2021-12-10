import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import {isPlatformBrowser} from '@angular/common';
import {ExecutiveReportService} from '../../../../../services/executive-report/executive-report.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ExecutiveReport} from '../../../../../models/executive-report';
import {InnovationFrontService} from '../../../../../services/innovation/innovation-front.service';
import {SpinnerService} from '../../../../../services/spinner/spinner.service';

@Component({
  templateUrl: './synthesis-complete.component.html',
  styleUrls: ['./synthesis-complete.component.scss']
})

export class SynthesisCompleteComponent implements OnInit {

  get adminLevel(): number {
    return this._authService.adminLevel;
  }

  private _projectId: string;

  private _shareKey: string;

  private _innovation: Innovation = <Innovation>{};

  private _displayReport = false;

  private _notFound = false;

  private _pageTitle = 'COMMON.PAGE_TITLE.REPORT';

  private _report: Innovation | ExecutiveReport = <Innovation | ExecutiveReport>{};

  private _reportTitle = '';

  private _reportMedia = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _executiveReportService: ExecutiveReportService,
              private _spinnerService: SpinnerService,
              private _translateTitleService: TranslateTitleService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _authService: AuthService) {
  }

  ngOnInit(): void {
    this._setSpinner();
    this._setPageTitle();

    this._activatedRoute.params.subscribe(params => {
      this._projectId = params['projectId'];
      this._shareKey = params['shareKey'];
      this._getSharedSynthesis();
    });
  }

  private _setSpinner(value= true) {
    this._spinnerService.state(value);
  }

  /***
   * this function is to get the shared synthesis detail from the server.
   */
  private _getSharedSynthesis() {
    if (isPlatformBrowser(this._platformId)) {
      this._innovationService.getSharedSynthesis(this._projectId, this._shareKey).pipe(first()).subscribe((response) => {
        this._innovation = response;
        this._getExecutiveReport();
        console.log(this._innovation);
        this._pageTitle = InnovationFrontService.currentLangInnovationCard(this._innovation, this.userLang, 'TITLE');
        this._setPageTitle();
      }, () => {
        this._displayReport = false;
        this._notFound = true;
        this._setSpinner(false);
      }, () => {
        if (this._innovation !== undefined) {
          this._displayReport = true;
        } else {
          this._notFound = true;
        }
      });
    }
  }

  /**
   * if the innovation has this._innovation.executiveReportId then we get that object from the back for the
   * front page because it has updated value for the client and objective.
   * @private
   */
  private _getExecutiveReport() {
    if (this._innovation && this._innovation.executiveReportId) {
      this._executiveReportService.get(this._innovation.executiveReportId).pipe(first()).subscribe((report) => {
        this._report = report;
        this._reportMedia = InnovationFrontService.principalMedia(this._innovation, this.userLang);
        this._reportTitle = InnovationFrontService.currentLangInnovationCard(this._innovation, this.userLang, 'TITLE');
        this._setSpinner(false);
      }, (err: HttpErrorResponse) => {
        this._report = this._innovation;
        this._setSpinner(false);
        console.error(err);
      });
    } else {
      this._report = this._innovation;
      this._setSpinner(false);
    }
  }

  private _setPageTitle() {
    if (!!this._pageTitle) {
      this._translateTitleService.setTitle(this._pageTitle);
    }
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
