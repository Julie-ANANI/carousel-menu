import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SpinnerService } from '../../../../../services/spinner/spinner';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { ErrorFrontService} from '../../../../../services/error/error-front';
import { TranslateService } from '@ngx-translate/core';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { ExecutiveReport } from '../../../../../models/executive-report';
import { Innovation } from '../../../../../models/innovation';
import { CommonService } from '../../../../../services/common/common.service';
import { ExecutiveReportService } from '../../../../../services/executive-report/executive-report.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'admin-storyboard',
  templateUrl: './admin-project-storyboard.component.html',
  styleUrls: ['./admin-project-storyboard.component.scss']
})

export class AdminProjectStoryboardComponent implements OnInit {

  private _executiveReport: ExecutiveReport = <ExecutiveReport>{};

  private _isLoading = true;

  private _isModalLang = false;

  private _modalTitle = '';

  private _selectedLang = this.currentLang;

  private _newSelectedLang = this.currentLang;

  private _toBeSaved = false;

  private _innovation: Innovation = <Innovation>{};

  private _reportType = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _spinnerService: SpinnerService,
              private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _executiveReportService: ExecutiveReportService,
              private _innovationFrontService: InnovationFrontService,
              private _commonService: CommonService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {

    this._setSpinner(true);

  }

  ngOnInit() {

    this._innovation = this._activatedRoute.snapshot.data['innovation'];
    this._setTitle(InnovationFrontService.currentLangInnovationCard(this._innovation, this.currentLang, 'title'));
    this._innovationFrontService.setInnovation(this._innovation);
    this.setNewSelectedLang();

    if (typeof this._innovation === 'undefined' || (this._innovation && !this._innovation._id)) {
      this._setSpinner(false);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage());
    } else if (this._innovation && this._innovation.executiveReportId) {
      this._getExecutiveReport();
    } else if (this._innovation && !this._innovation.executiveReportId) {
      this._setSpinner(false);
      this._isLoading = false;
    }

  }

  private _getExecutiveReport() {
    if (isPlatformBrowser(this._platformId) && this._innovation && this._innovation.executiveReportId) {
      this._executiveReportService.get(this._innovation.executiveReportId).pipe(first()).subscribe((response) => {
        this._executiveReport = response;
        this._setSpinner(false);
        this._isLoading = false;
      }, (err: HttpErrorResponse) => {
        this._setSpinner(false);
        console.log(err);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      });
    }
  }

  private _setSpinner(value: boolean) {
    this._spinnerService.state(value);
  }

  private _setTitle(title?: string) {
    this._translateTitleService.setTitle(title ? title + ' | Storyboard | UMI' : 'Storyboard | UMI');
  }

  public setNewSelectedLang(value?: string) {
    this._newSelectedLang = value ? value : this._selectedLang;
  }

  public autofillExecutiveReport(event: Event) {
    event.preventDefault();
  }

  public openLangModal(event: Event, type: string) {
    event.preventDefault();
    this._reportType = type;
    this._modalTitle = this._executiveReport.lang ? 'STORYBOARD.MODAL.CHANGE_TITLE' : 'STORYBOARD.MODAL.SELECT_TITLE';
    this._isModalLang = true;
  }

  public onClickConfirm(event: Event) {
    event.preventDefault();
    this._setSpinner(true);
    this._isModalLang = false;
    this._isLoading = true;

    switch (this._reportType) {

      case 'CREATE':
        this._createExecutiveReport();
        break;

      case 'RESET':
        this._resetExecutiveReport();
        break;

    }

    this._reportType = '';

  }

  private _createExecutiveReport() {
    this._executiveReportService.create(this._newSelectedLang, this._innovation._id).pipe(first()).subscribe((response) => {
      this._executiveReport = response;
      this._setSpinner(false);
      this._isLoading = false;
    }, (err: HttpErrorResponse) => {
      this._setSpinner(false);
      console.log(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
  }

  private _resetExecutiveReport() {
    this._executiveReportService.reset(this._executiveReport, this._newSelectedLang).pipe(first()).subscribe((response) => {
      this._executiveReport = response;
      this._setSpinner(false);
      this._isLoading = false;
    }, (err: HttpErrorResponse) => {
      this._setSpinner(false);
      console.log(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
  }

  public copyLink(event: Event, linkToCopy: string) {
    event.preventDefault();
    this._commonService.copyToClipboard(linkToCopy);
    this._translateNotificationsService.success('ERROR.SUCCESS', 'STORYBOARD.TOAST.URL_COPIED');
  }

  public generateVideo(event: Event) {
    event.preventDefault();
  }

  public generatePdf(event: Event) {
    event.preventDefault();
  }

  public saveExecutiveReport(event: Event) {
    event.preventDefault();
    this._executiveReportService.save(this._executiveReport).pipe(first()).subscribe((response) => {
      this._toBeSaved = false;
      this._translateNotificationsService.success('ERROR.SUCCESS', 'EXECUTIVE_REPORT.SAVE');
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get isModalLang(): boolean {
    return this._isModalLang;
  }

  set isModalLang(value: boolean) {
    this._isModalLang = value;
  }

  get executiveReport(): ExecutiveReport {
    return this._executiveReport;
  }

  set executiveReport(value: ExecutiveReport) {
    this._executiveReport = value;
    this._toBeSaved = true;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get selectedLang(): string {
    return this._selectedLang;
  }

  get modalTitle(): string {
    return this._modalTitle;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

}
