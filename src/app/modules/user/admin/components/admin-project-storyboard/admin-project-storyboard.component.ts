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

@Component({
  selector: 'admin-storyboard',
  templateUrl: './admin-project-storyboard.component.html',
  styleUrls: ['./admin-project-storyboard.component.scss']
})

export class AdminProjectStoryboardComponent implements OnInit {

  private _executiveReport: ExecutiveReport = <ExecutiveReport>{};

  private _isLoading = false;

  private _isModalLang = false;

  private _modalTitle = '';

  private _selectedLang = this.currentLang;

  newSelectedLang = this.currentLang;

  private _toBeSaved = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _spinnerService: SpinnerService,
              private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _commonService: CommonService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {

    this._setSpinner(true);

    this._activatedRoute.params.subscribe((params) => {
      this._getExecutiveReport(params['projectId']);
    });

  }

  ngOnInit() {

    const innovation: Innovation = this._activatedRoute.snapshot.data['innovation'];
    this._setTitle(InnovationFrontService.currentLangInnovationCard(innovation, this.currentLang, 'title'));

    if (typeof innovation === 'undefined' || (innovation && !innovation._id)) {
      this._isLoading = true;
      this._setSpinner(false);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage());
    }

    this.setNewSelectedLang();

  }

  private _getExecutiveReport(id: string) {
    if (isPlatformBrowser(this._platformId)) {
      // todo add the service to get the executive report from back using id.
      // todo assign the selected lang, nextSelected lang, executiveReport

      // temporary
      this._executiveReport = {
        lang: 'en',
        completion: 100
      };

      this._isLoading = false;
      this._setSpinner(false);
    }
  }

  private _setSpinner(value: boolean) {
    this._spinnerService.state(value);
  }

  private _setTitle(title?: string) {
    this._translateTitleService.setTitle(title ? title + ' | Storyboard | UMI' : 'Storyboard | UMI');
  }

  public setNewSelectedLang(value?: string) {
    this.newSelectedLang = value ? value : this._selectedLang;
  }

  public openLangModal(event: Event) {
    event.preventDefault();
    this._modalTitle = this._executiveReport.lang ? 'STORYBOARD.MODAL.CHANGE_TITLE' : 'STORYBOARD.MODAL.SELECT_TITLE';
    this._isModalLang = true;
  }

  public onClickConfirm(event: Event) {
    event.preventDefault();
    this._setSpinner(true);
    this._isModalLang = false;
    this._isLoading = true;
    this._createExecutiveReport();
  }

  private _createExecutiveReport() {
    // todo add the service to create the executive report.
    this._setSpinner(false);
    this._isLoading = false;
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

    // todo save the executive report in back
    // todo show notification success or error.
    // todo make saveButton value false toBeSaved = false;

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

}
